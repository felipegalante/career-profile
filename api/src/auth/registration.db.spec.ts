import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { createTestApi, graphqlClient, REGISTER, SESSION_COOKIE, CSRF_COOKIE, uniqueEmail, VALID_PASSWORD, VIEWER, type TestApi, type ViewerFields } from "../../test/auth-api.js";
import { sessions, userProfiles, users } from "../db/schema.js";

const databaseUrl = inject("databaseUrl");
type RegisterData = { register: { viewer: ViewerFields } };

describe.skipIf(!databaseUrl)("public registration", () => {
  let api: TestApi;

  beforeAll(async () => {
    api = await createTestApi(databaseUrl!);
  });

  afterAll(async () => {
    await api?.close();
  });

  async function accountsFor(email: string) {
    return api.database.db.select().from(users).where(eq(users.normalizedEmail, email.toLowerCase()));
  }

  it("creates one USER with a profile, a hashed password and a working session", async () => {
    const request = graphqlClient(api);
    const email = uniqueEmail("register");

    const registered = await request<RegisterData>(REGISTER, { variables: { input: { email, password: VALID_PASSWORD } } });

    expect(registered.errors).toBeUndefined();
    expect(registered.data?.register.viewer).toMatchObject({ email, role: "USER", passwordSetupRequired: false, onboardingCompleted: false });
    expect(registered.cookies.find((cookie) => cookie.name === SESSION_COOKIE)).toMatchObject({ httpOnly: true, path: "/", sameSite: "Lax" });
    expect(registered.cookies.find((cookie) => cookie.name === CSRF_COOKIE)?.httpOnly).toBeFalsy();

    const [account] = await accountsFor(email);
    expect(account).toMatchObject({ role: "USER", passwordSetupRequired: false, onboardingCompletedAt: null });
    expect(account?.passwordHash).toMatch(/^\$argon2id\$/);
    expect(account?.passwordHash).not.toContain(VALID_PASSWORD);
    expect(await api.database.db.select().from(userProfiles).where(eq(userProfiles.userId, account!.id))).toHaveLength(1);
    expect(await api.database.db.select().from(sessions).where(eq(sessions.userId, account!.id))).toHaveLength(1);

    const viewer = await request<{ viewer: ViewerFields | null }>(VIEWER, { session: registered.session });
    expect(viewer.data?.viewer?.email).toBe(email);
  });

  it("rejects an invalid email or a weak password with a field error and creates no account", async () => {
    const request = graphqlClient(api);
    const weakEmail = uniqueEmail("weak");

    const invalidEmail = await request<RegisterData>(REGISTER, { variables: { input: { email: "not-an-email", password: VALID_PASSWORD } } });
    const weakPassword = await request<RegisterData>(REGISTER, { variables: { input: { email: weakEmail, password: "alllowercase" } } });

    expect(invalidEmail.errors?.[0]?.extensions).toMatchObject({ code: "VALIDATION_FAILED", fieldErrors: [{ path: "email" }] });
    expect(weakPassword.errors?.[0]?.extensions).toMatchObject({ code: "VALIDATION_FAILED", fieldErrors: [{ path: "password" }] });
    expect(invalidEmail.session).toBeUndefined();
    expect(weakPassword.session).toBeUndefined();
    expect(await accountsFor(weakEmail)).toHaveLength(0);
  });

  it("rejects a role in the registration input, whether as a variable or a literal", async () => {
    const request = graphqlClient(api);
    const variableEmail = uniqueEmail("forged-variable");
    const literalEmail = uniqueEmail("forged-literal");

    const forgedVariable = await request<RegisterData>(REGISTER, { variables: { input: { email: variableEmail, password: VALID_PASSWORD, role: "ADMIN" } } });
    const forgedLiteral = await request<RegisterData>(
      `mutation { register(input: { email: "${literalEmail}", password: "${VALID_PASSWORD}", role: ADMIN }) { viewer { role } } }`
    );

    expect(forgedVariable.data?.register).toBeUndefined();
    expect(forgedVariable.errors).toHaveLength(1);
    expect(forgedLiteral.data?.register).toBeUndefined();
    expect(forgedLiteral.errors?.[0]?.extensions?.code).toBe("GRAPHQL_VALIDATION_FAILED");
    expect(await accountsFor(variableEmail)).toHaveLength(0);
    expect(await accountsFor(literalEmail)).toHaveLength(0);
  });

  it("creates exactly one account when registrations for the same normalized email race", async () => {
    const email = uniqueEmail("race");
    const attempts = await Promise.all([
      graphqlClient(api)<RegisterData>(REGISTER, { variables: { input: { email, password: VALID_PASSWORD } } }),
      graphqlClient(api)<RegisterData>(REGISTER, { variables: { input: { email: email.toUpperCase(), password: VALID_PASSWORD } } }),
    ]);

    expect(attempts.filter((attempt) => attempt.data?.register)).toHaveLength(1);
    expect(attempts.flatMap((attempt) => attempt.errors ?? []).map((error) => error.extensions?.code)).toEqual(["DUPLICATE_EMAIL"]);
    const accounts = await accountsFor(email);
    expect(accounts).toHaveLength(1);
    expect(await api.database.db.select().from(userProfiles).where(eq(userProfiles.userId, accounts[0]!.id))).toHaveLength(1);
  });
});
