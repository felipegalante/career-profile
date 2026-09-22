import { createHmac, randomBytes } from "node:crypto";
import { Algorithm, hash, verify } from "@node-rs/argon2";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import type { AppDatabase } from "../db.js";
import { authAttemptWindows, passwordSetupGrants, sessions, userProfiles, users } from "../db/schema.js";
import { AuthError } from "./errors.js";

const PASSWORD_OPTIONS = { algorithm: Algorithm.Argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1, outputLen: 32 } as const;
const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_IDLE_MS = 24 * 60 * 60 * 1000;
const GRANT_LIFETIME_MS = 30 * 60 * 1000;
const LOGIN_LIMIT = 5;
const IP_LIMIT = 20;

export type Viewer = { id: string; email: string; role: "USER" | "ADMIN"; passwordSetupRequired: boolean; onboardingCompleted: boolean };
export type AuthSession = { sessionToken: string; csrfToken: string; expiresAt: Date; viewer: Viewer };

export function normalizeEmail(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

export function validatePassword(password: string): void {
  if (password.length < 10 || password.length > 128 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    throw new AuthError("VALIDATION_FAILED", "Use 10–128 characters with uppercase, lowercase, number, and symbol.", "password");
  }
}

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class AuthService {
  constructor(private readonly database: AppDatabase, private readonly sessionSecret: string) {}

  private fingerprint(value: string): string {
    return createHmac("sha256", this.sessionSecret || "local-development-secret").update(value).digest("base64url");
  }

  private randomToken(): string { return randomBytes(32).toString("base64url"); }

  private async assertBelowLimit(scope: string, identifier: string, limit: number): Promise<void> {
    const key = `${scope}:${this.fingerprint(identifier)}`;
    const row = await this.database.db.select().from(authAttemptWindows).where(eq(authAttemptWindows.key, key)).limit(1);
    if (row[0] && row[0].expiresAt > new Date() && row[0].attempts >= limit) throw new AuthError("RATE_LIMITED", "Too many attempts. Try again later.");
  }

  private async recordAttempt(scope: string, identifier: string, lifetimeMs = 15 * 60 * 1000): Promise<void> {
    const key = `${scope}:${this.fingerprint(identifier)}`;
    const expiresAt = new Date(Date.now() + lifetimeMs);
    await this.database.db.execute(sql`
      INSERT INTO auth_attempt_windows (key, attempts, expires_at, updated_at)
      VALUES (${key}, 1, ${expiresAt}, now())
      ON CONFLICT (key) DO UPDATE SET
        attempts = CASE WHEN auth_attempt_windows.expires_at <= now() THEN 1 ELSE auth_attempt_windows.attempts + 1 END,
        expires_at = CASE WHEN auth_attempt_windows.expires_at <= now() THEN ${expiresAt} ELSE auth_attempt_windows.expires_at END,
        updated_at = now()
    `);
  }

  private viewer(user: typeof users.$inferSelect): Viewer {
    return { id: user.id, email: user.email, role: user.role, passwordSetupRequired: user.passwordSetupRequired, onboardingCompleted: user.onboardingCompletedAt !== null };
  }

  private async createSession(tx: any, user: typeof users.$inferSelect): Promise<AuthSession> {
    const sessionToken = this.randomToken();
    const csrfToken = this.randomToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_LIFETIME_MS);
    await tx.insert(sessions).values({
      userId: user.id,
      tokenHash: this.fingerprint(sessionToken),
      csrfTokenHash: this.fingerprint(csrfToken),
      credentialGeneration: user.credentialGeneration,
      expiresAt,
      lastSeenAt: now,
    });
    return { sessionToken, csrfToken, expiresAt, viewer: this.viewer(user) };
  }

  async register(input: { email: string; password: string }, ip: string): Promise<AuthSession> {
    const normalizedEmail = normalizeEmail(input.email);
    if (!validEmail(normalizedEmail)) throw new AuthError("VALIDATION_FAILED", "Enter a valid email address.", "email");
    validatePassword(input.password);
    await this.assertBelowLimit("register-ip", ip, 10);
    const passwordHash = await hash(input.password, PASSWORD_OPTIONS);
    try {
      return await this.database.db.transaction(async (tx) => {
        const inserted = await tx.insert(users).values({ email: input.email.trim(), normalizedEmail, passwordHash, role: "USER" }).onConflictDoNothing().returning();
        const user = inserted[0];
        if (!user) throw new AuthError("DUPLICATE_EMAIL", "An account already uses this email address.", "email");
        await tx.insert(userProfiles).values({ userId: user.id });
        return this.createSession(tx, user);
      });
    } catch (error) {
      if (error instanceof AuthError) throw error;
      await this.recordAttempt("register-ip", ip, 60 * 60 * 1000);
      throw error;
    }
  }

  async login(input: { email: string; password: string }, ip: string): Promise<AuthSession> {
    const normalizedEmail = normalizeEmail(input.email);
    await this.assertBelowLimit("login-email", normalizedEmail, LOGIN_LIMIT);
    await this.assertBelowLimit("login-ip", ip, IP_LIMIT);
    const user = (await this.database.db.select().from(users).where(eq(users.normalizedEmail, normalizedEmail)).limit(1))[0];
    const passwordValid = user?.passwordHash ? await verify(user.passwordHash, input.password, PASSWORD_OPTIONS) : false;
    if (!user || !passwordValid || user.passwordSetupRequired) {
      await Promise.all([this.recordAttempt("login-email", normalizedEmail), this.recordAttempt("login-ip", ip)]);
      throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
    }
    return this.database.db.transaction(async (tx) => {
      const current = (await tx.select().from(users).where(eq(users.id, user.id)).limit(1))[0];
      if (!current || current.passwordSetupRequired || current.credentialGeneration !== user.credentialGeneration) throw new AuthError("INVALID_CREDENTIALS", "Invalid email or password.");
      return this.createSession(tx, current);
    });
  }

  async viewerForToken(token: string | undefined): Promise<Viewer | null> {
    if (!token) return null;
    const row = await this.database.db.select({ session: sessions, user: users }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(and(eq(sessions.tokenHash, this.fingerprint(token)), isNull(sessions.revokedAt))).limit(1);
    const record = row[0];
    if (!record || record.session.expiresAt <= new Date() || record.session.lastSeenAt.getTime() + SESSION_IDLE_MS <= Date.now() || record.session.credentialGeneration !== record.user.credentialGeneration) return null;
    await this.database.db.update(sessions).set({ lastSeenAt: new Date(), updatedAt: new Date() }).where(eq(sessions.id, record.session.id));
    return this.viewer(record.user);
  }

  async csrfValid(sessionToken: string | undefined, csrfToken: string | undefined): Promise<boolean> {
    if (!sessionToken) return true;
    if (!csrfToken) return false;
    const row = await this.database.db.select({ csrfTokenHash: sessions.csrfTokenHash }).from(sessions).where(and(eq(sessions.tokenHash, this.fingerprint(sessionToken)), isNull(sessions.revokedAt))).limit(1);
    return row[0]?.csrfTokenHash === this.fingerprint(csrfToken);
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token) return;
    await this.database.db.update(sessions).set({ revokedAt: new Date(), updatedAt: new Date() }).where(and(eq(sessions.tokenHash, this.fingerprint(token)), isNull(sessions.revokedAt)));
  }

  // Used by Phase 10 and controlled fixtures; never exposed through public GraphQL.
  async issueSetupGrant(userId: string, purpose: "FIRST_PASSWORD" | "RESET"): Promise<string> {
    const proof = this.randomToken();
    const now = new Date();
    await this.database.db.transaction(async (tx) => {
      const user = (await tx.select().from(users).where(eq(users.id, userId)).limit(1))[0];
      if (!user || !user.passwordSetupRequired) throw new Error("Setup grants require a password-setup account.");
      await tx.insert(passwordSetupGrants).values({ userId, tokenHash: this.fingerprint(proof), purpose, credentialGeneration: user.credentialGeneration, expiresAt: new Date(now.getTime() + GRANT_LIFETIME_MS) });
    });
    return proof;
  }

  // Phase 10 invokes this lifecycle after its authorization and audit checks; it has no public GraphQL resolver.
  async requirePasswordSetup(userId: string, purpose: "FIRST_PASSWORD" | "RESET"): Promise<string> {
    const proof = this.randomToken();
    const now = new Date();
    await this.database.db.transaction(async (tx) => {
      const user = (await tx.select().from(users).where(eq(users.id, userId)).limit(1))[0];
      if (!user) throw new Error("Cannot reset credentials for a missing user.");
      const changed = await tx.update(users).set({ passwordHash: null, passwordSetupRequired: true, credentialGeneration: sql`${users.credentialGeneration} + 1`, updatedAt: now }).where(eq(users.id, userId)).returning();
      const resetUser = changed[0];
      await tx.update(sessions).set({ revokedAt: now, updatedAt: now }).where(and(eq(sessions.userId, userId), isNull(sessions.revokedAt)));
      await tx.update(passwordSetupGrants).set({ revokedAt: now, updatedAt: now }).where(and(eq(passwordSetupGrants.userId, userId), isNull(passwordSetupGrants.consumedAt), isNull(passwordSetupGrants.revokedAt)));
      await tx.insert(passwordSetupGrants).values({ userId, tokenHash: this.fingerprint(proof), purpose, credentialGeneration: resetUser.credentialGeneration, expiresAt: new Date(now.getTime() + GRANT_LIFETIME_MS) });
    });
    return proof;
  }

  async setPassword(input: { proof: string; password: string }, ip: string): Promise<AuthSession> {
    validatePassword(input.password);
    await this.assertBelowLimit("setup-proof", input.proof, LOGIN_LIMIT);
    await this.assertBelowLimit("setup-ip", ip, IP_LIMIT);
    const passwordHash = await hash(input.password, PASSWORD_OPTIONS);
    const now = new Date();
    try {
      return await this.database.db.transaction(async (tx) => {
        const grant = (await tx.select().from(passwordSetupGrants).where(eq(passwordSetupGrants.tokenHash, this.fingerprint(input.proof))).limit(1))[0];
        if (!grant || grant.expiresAt <= now || grant.consumedAt || grant.revokedAt) throw new AuthError("INVALID_SETUP_GRANT", "This setup link is invalid, expired, or already used.");
        const user = (await tx.select().from(users).where(eq(users.id, grant.userId)).limit(1))[0];
        if (!user || !user.passwordSetupRequired || user.credentialGeneration !== grant.credentialGeneration) throw new AuthError("INVALID_SETUP_GRANT", "This setup link is invalid, expired, or already used.");
        const changed = await tx.update(users).set({ passwordHash, passwordSetupRequired: false, updatedAt: now }).where(and(eq(users.id, user.id), eq(users.credentialGeneration, grant.credentialGeneration), eq(users.passwordSetupRequired, true))).returning();
        if (!changed[0]) throw new AuthError("INVALID_SETUP_GRANT", "This setup link is invalid, expired, or already used.");
        await tx.update(passwordSetupGrants).set({ consumedAt: now, updatedAt: now }).where(and(eq(passwordSetupGrants.id, grant.id), isNull(passwordSetupGrants.consumedAt), isNull(passwordSetupGrants.revokedAt), gt(passwordSetupGrants.expiresAt, now)));
        await tx.update(passwordSetupGrants).set({ revokedAt: now, updatedAt: now }).where(and(eq(passwordSetupGrants.userId, user.id), isNull(passwordSetupGrants.consumedAt), isNull(passwordSetupGrants.revokedAt)));
        await tx.update(sessions).set({ revokedAt: now, updatedAt: now }).where(and(eq(sessions.userId, user.id), isNull(sessions.revokedAt)));
        return this.createSession(tx, changed[0]);
      });
    } catch (error) {
      if (!(error instanceof AuthError)) throw error;
      await Promise.all([this.recordAttempt("setup-proof", input.proof), this.recordAttempt("setup-ip", ip)]);
      throw error;
    }
  }
}
