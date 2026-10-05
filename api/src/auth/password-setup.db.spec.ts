import { and, eq, isNull, sql } from "drizzle-orm";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { completeOnboarding, createTestApi, graphqlClient, insertSetupRequiredUser, LOGIN, REGISTER, SET_PASSWORD, uniqueEmail, VALID_PASSWORD, VIEWER, type BrowserSession, type TestApi, type ViewerFields } from "../../test/auth-api.js";
import type { AppDatabase } from "../db.js";
import { passwordSetupGrants, sessions, users } from "../db/schema.js";

const databaseUrl = inject("databaseUrl");
const NEW_PASSWORD = "NewPassword!2";
const UNAVAILABLE = { code: "INVALID_SETUP_GRANT", message: "This setup link is invalid, expired, or already used." };
type SetPasswordData = { setPassword: { viewer: Omit<ViewerFields, "role"> } };
type LoginData = { login: { viewer: ViewerFields } };
type ViewerData = { viewer: ViewerFields | null };

describe.skipIf(!databaseUrl)("password setup and reset", () => {
  let api: TestApi;

  beforeAll(async () => {
    api = await createTestApi(databaseUrl!);
  });

  afterAll(async () => {
    await api?.close();
  });

  function setPassword(proof: string, password = NEW_PASSWORD) {
    return graphqlClient(api)<SetPasswordData>(SET_PASSWORD, { variables: { input: { proof, password } } });
  }

  function failureOf(response: { errors?: Array<{ message: string; extensions?: { code?: string } }> }) {
    return response.errors?.map(({ message, extensions }) => ({ code: extensions?.code, message }));
  }

  async function accountState(userId: string) {
    const [account] = await api.database.db.select().from(users).where(eq(users.id, userId));
    return account!;
  }

  async function registeredAccount(): Promise<{ id: string; email: string; session: BrowserSession }> {
    const email = uniqueEmail("reset");
    const registered = await graphqlClient(api)<{ register: { viewer: ViewerFields } }>(REGISTER, { variables: { input: { email, password: VALID_PASSWORD } } });
    if (!registered.session || !registered.data) throw new Error("Registration did not establish a session.");
    return { id: registered.data.register.viewer.id, email, session: registered.session };
  }

  it("establishes a first password from a valid proof and leaves onboarding incomplete", async () => {
    const account = await insertSetupRequiredUser(api.database, { onboardingCompleted: false });
    const proof = await api.auth.issueSetupGrant(account.id, "FIRST_PASSWORD");

    const established = await setPassword(proof);

    expect(established.errors).toBeUndefined();
    expect(established.data?.setPassword.viewer).toMatchObject({ email: account.email, passwordSetupRequired: false, onboardingCompleted: false });
    const viewer = await graphqlClient(api)<ViewerData>(VIEWER, { session: established.session });
    expect(viewer.data?.viewer?.email).toBe(account.email);
    const signedIn = await graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: account.email, password: NEW_PASSWORD } } });
    expect(signedIn.data?.login.viewer.email).toBe(account.email);
  });

  it("rejects unknown, expired, superseded and replayed proofs with the same error", async () => {
    const expiredAccount = await insertSetupRequiredUser(api.database, { onboardingCompleted: false });
    const expiredProof = await api.auth.issueSetupGrant(expiredAccount.id, "FIRST_PASSWORD");
    await api.database.db.update(passwordSetupGrants).set({ expiresAt: new Date(Date.now() - 60_000) }).where(eq(passwordSetupGrants.userId, expiredAccount.id));

    const reissuedAccount = await insertSetupRequiredUser(api.database, { onboardingCompleted: false });
    const supersededProof = await api.auth.issueSetupGrant(reissuedAccount.id, "FIRST_PASSWORD");
    const currentProof = await api.auth.issueSetupGrant(reissuedAccount.id, "FIRST_PASSWORD");

    const unknown = await setPassword("not-an-issued-proof");
    const expired = await setPassword(expiredProof);
    const superseded = await setPassword(supersededProof);
    expect((await setPassword(currentProof)).errors).toBeUndefined();
    const replayed = await setPassword(currentProof);

    for (const rejected of [unknown, expired, superseded, replayed]) {
      expect(failureOf(rejected)).toEqual([UNAVAILABLE]);
      expect(rejected.session).toBeUndefined();
    }
    expect(await accountState(expiredAccount.id)).toMatchObject({ passwordSetupRequired: true, passwordHash: null });
  });

  it("enforces the password policy without consuming the proof", async () => {
    const account = await insertSetupRequiredUser(api.database, { onboardingCompleted: false });
    const proof = await api.auth.issueSetupGrant(account.id, "FIRST_PASSWORD");

    const weak = await setPassword(proof, "weakpassword");
    const retried = await setPassword(proof);

    expect(weak.errors?.[0]?.extensions).toMatchObject({ code: "VALIDATION_FAILED", fieldErrors: [{ path: "password" }] });
    expect(retried.data?.setPassword.viewer.passwordSetupRequired).toBe(false);
  });

  it("revokes sessions and the old password on reset, and keeps onboarding completed after the new password", async () => {
    const account = await registeredAccount();
    await completeOnboarding(api.database, account.id);

    const proof = await api.auth.requirePasswordSetup(account.id, "RESET");

    const oldSession = await graphqlClient(api)<ViewerData>(VIEWER, { session: account.session });
    const oldPassword = await graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: account.email, password: VALID_PASSWORD } } });
    expect(oldSession.data?.viewer).toBeNull();
    expect(await api.database.db.select().from(sessions).where(and(eq(sessions.userId, account.id), isNull(sessions.revokedAt)))).toEqual([]);
    expect(oldPassword.errors?.[0]?.extensions?.code).toBe("INVALID_CREDENTIALS");
    expect(await accountState(account.id)).toMatchObject({ passwordSetupRequired: true, passwordHash: null });

    const established = await setPassword(proof);
    expect(established.data?.setPassword.viewer).toMatchObject({ email: account.email, passwordSetupRequired: false, onboardingCompleted: true });
    const signedIn = await graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: account.email, password: NEW_PASSWORD } } });
    expect(signedIn.data?.login.viewer.onboardingCompleted).toBe(true);
  });

  it("invalidates the proof from an earlier reset when the account is reset again", async () => {
    const account = await registeredAccount();
    const firstProof = await api.auth.requirePasswordSetup(account.id, "RESET");
    const secondProof = await api.auth.requirePasswordSetup(account.id, "RESET");

    expect(failureOf(await setPassword(firstProof))).toEqual([UNAVAILABLE]);
    expect((await setPassword(secondProof)).errors).toBeUndefined();
  });

  it("does not issue a session to a sign-in that verified the old password before a reset committed", async () => {
    const account = await registeredAccount();
    const blocker = new pg.Client({ connectionString: databaseUrl! });
    await blocker.connect();

    try {
      // Holding the account row lock queues the reset first and the sign-in's guarded update
      // second, so the sign-in resumes only after the reset has changed the credentials.
      await blocker.query("BEGIN");
      await blocker.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [account.id]);
      const reset = api.auth.requirePasswordSetup(account.id, "RESET");
      await waitForBlockedUserUpdates(api.database, 1);
      const signIn = graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: account.email, password: VALID_PASSWORD } } });
      await waitForBlockedUserUpdates(api.database, 2);
      await blocker.query("COMMIT");

      const [, signedIn] = await Promise.all([reset, signIn]);

      expect(signedIn.errors?.[0]?.extensions?.code).toBe("INVALID_CREDENTIALS");
      expect(signedIn.session).toBeUndefined();
      const current = await accountState(account.id);
      const usable = await api.database.db.select().from(sessions).where(eq(sessions.userId, account.id));
      expect(usable.filter((session) => session.revokedAt === null && session.credentialGeneration === current.credentialGeneration)).toEqual([]);
    } finally {
      await blocker.query("ROLLBACK").catch(() => {});
      await blocker.end();
    }
  });
});

// Polls from its own autocommit queries: a session inside a transaction sees a frozen
// pg_stat_activity snapshot.
async function waitForBlockedUserUpdates(database: AppDatabase, count: number): Promise<void> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const result = await database.db.execute<{ blocked: number }>(sql`
      SELECT count(*)::int AS blocked FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock' AND query ILIKE 'update "users"%'
    `);
    if ((result.rows[0]?.blocked ?? 0) >= count) return;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`Timed out waiting for ${count} blocked account update(s).`);
}
