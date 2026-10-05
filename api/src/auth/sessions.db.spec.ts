import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { createTestApi, graphqlClient, insertSetupRequiredUser, LOGIN, LOGOUT, REGISTER, SESSION_COOKIE, CSRF_COOKIE, uniqueEmail, VALID_PASSWORD, VIEWER, type BrowserSession, type TestApi, type ViewerFields } from "../../test/auth-api.js";

const databaseUrl = inject("databaseUrl");
type LoginData = { login: { viewer: ViewerFields } };
type ViewerData = { viewer: ViewerFields | null };

describe.skipIf(!databaseUrl)("sign-in sessions", () => {
  let api: TestApi;

  beforeAll(async () => {
    api = await createTestApi(databaseUrl!);
  });

  afterAll(async () => {
    await api?.close();
  });

  async function registeredAccount(): Promise<{ email: string; session: BrowserSession }> {
    const email = uniqueEmail("session");
    const registered = await graphqlClient(api)(REGISTER, { variables: { input: { email, password: VALID_PASSWORD } } });
    if (!registered.session) throw new Error("Registration did not establish a session.");
    return { email, session: registered.session };
  }

  it("signs in with valid credentials and resolves the viewer from the new session cookie", async () => {
    const { email } = await registeredAccount();
    const request = graphqlClient(api);

    const signedIn = await request<LoginData>(LOGIN, { variables: { input: { email: email.toUpperCase(), password: VALID_PASSWORD } } });

    expect(signedIn.errors).toBeUndefined();
    expect(signedIn.data?.login.viewer).toMatchObject({ email, role: "USER" });
    expect(signedIn.cookies.find((cookie) => cookie.name === SESSION_COOKIE)).toMatchObject({ httpOnly: true, path: "/", sameSite: "Lax" });
    const viewer = await request<ViewerData>(VIEWER, { session: signedIn.session });
    expect(viewer.data?.viewer?.email).toBe(email);
  });

  it("returns one indistinguishable failure for an unknown email, a wrong password and an account awaiting setup", async () => {
    const { email } = await registeredAccount();
    const awaitingSetup = await insertSetupRequiredUser(api.database, { onboardingCompleted: false });

    const failures = await Promise.all([
      graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: uniqueEmail("unknown"), password: VALID_PASSWORD } } }),
      graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email, password: "WrongPassword!1" } } }),
      graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: awaitingSetup.email, password: VALID_PASSWORD } } }),
    ]);

    for (const failure of failures) {
      expect(failure.data?.login).toBeUndefined();
      expect(failure.session).toBeUndefined();
      expect(failure.errors?.map(({ message, extensions }) => ({ message, code: extensions?.code }))).toEqual([{ message: "Invalid email or password.", code: "INVALID_CREDENTIALS" }]);
    }
  });

  it("locks sign-in for an email after five failures in any letter case, even with the right password", async () => {
    const { email } = await registeredAccount();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const variant = attempt % 2 === 0 ? email : email.toUpperCase();
      const failed = await graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: variant, password: "WrongPassword!1" } } });
      expect(failed.errors?.[0]?.extensions?.code).toBe("INVALID_CREDENTIALS");
    }
    const unseenVariant = `${email.charAt(0).toUpperCase()}${email.slice(1)}`;
    const locked = await graphqlClient(api)<LoginData>(LOGIN, { variables: { input: { email: unseenVariant, password: VALID_PASSWORD } } });

    expect(locked.errors?.[0]?.extensions?.code).toBe("RATE_LIMITED");
    expect(locked.session).toBeUndefined();
  });

  it("revokes the session on logout so a replayed cookie no longer resolves a viewer", async () => {
    const { session } = await registeredAccount();
    const request = graphqlClient(api);

    const loggedOut = await request<{ logout: { success: boolean } }>(LOGOUT, { session });
    const replayed = await request<ViewerData>(VIEWER, { session });

    expect(loggedOut.data?.logout.success).toBe(true);
    for (const name of [SESSION_COOKIE, CSRF_COOKIE]) {
      expect(loggedOut.cookies.find((cookie) => cookie.name === name)).toMatchObject({ value: "", maxAge: 0 });
    }
    expect(replayed.data?.viewer).toBeNull();
  });

  it("treats a revoked session cookie as signed out, so the browser holding it can sign in again", async () => {
    const { email, session } = await registeredAccount();
    const request = graphqlClient(api);
    await request(LOGOUT, { session });

    const signedIn = await request<LoginData>(LOGIN, { session, variables: { input: { email, password: VALID_PASSWORD } } });

    expect(signedIn.statusCode).toBe(200);
    expect(signedIn.data?.login.viewer.email).toBe(email);
    expect(signedIn.session?.sessionToken).not.toBe(session.sessionToken);
  });

  it("refuses a mutation that carries a session cookie without its CSRF token and keeps the session", async () => {
    const { session } = await registeredAccount();
    const request = graphqlClient(api);

    const missingToken = await request(LOGOUT, { session, csrfToken: null });
    const wrongToken = await request(LOGOUT, { session, csrfToken: "not-the-session-token" });
    const viewer = await request<ViewerData>(VIEWER, { session });

    expect(missingToken.statusCode).toBe(403);
    expect(wrongToken.statusCode).toBe(403);
    expect(viewer.data?.viewer).not.toBeNull();
  });
});
