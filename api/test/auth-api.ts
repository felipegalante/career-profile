import { randomInt, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createApp } from "../src/app.js";
import { AuthService } from "../src/auth/service.js";
import { createDatabase, type AppDatabase } from "../src/db.js";
import { userProfiles, users } from "../src/db/schema.js";

export const APP_ORIGIN = "http://localhost:5173";
export const SESSION_COOKIE = "career_profile_session";
export const CSRF_COOKIE = `${SESSION_COOKIE}_csrf`;
export const VALID_PASSWORD = "ValidPassword!1";

// The app and the directly constructed service must share the secret so token hashes match.
const TOKEN_HASH_SECRET = "database-test-session-secret";

export type TestApi = {
  app: ReturnType<typeof createApp>;
  auth: AuthService;
  database: AppDatabase;
  close(): Promise<void>;
};

export async function createTestApi(databaseUrl: string): Promise<TestApi> {
  const database = createDatabase(databaseUrl);
  const app = createApp({ appOrigin: APP_ORIGIN, database, sessionCookieName: SESSION_COOKIE, sessionSecret: TOKEN_HASH_SECRET });
  await app.ready();
  return {
    app,
    auth: new AuthService(database, TOKEN_HASH_SECRET),
    database,
    close: async () => {
      await app.close();
      await database.close();
    },
  };
}

export type BrowserSession = { sessionToken: string; csrfToken: string };
export type GraphqlError = { message: string; extensions?: { code?: string; fieldErrors?: Array<{ code: string; path: string }> } };
export type ResponseCookie = { name: string; value: string; httpOnly?: boolean; maxAge?: number; path?: string; sameSite?: string; secure?: boolean };
export type GraphqlResponse<T> = {
  statusCode: number;
  data: T | null | undefined;
  errors: GraphqlError[] | undefined;
  cookies: ResponseCookie[];
  /** The session the response established, when it set both session cookies. */
  session: BrowserSession | undefined;
};
type RequestOptions = { variables?: Record<string, unknown>; session?: BrowserSession; csrfToken?: string | null };

/**
 * Sends GraphQL requests as the same-origin web client does. Each client has its own remote
 * address so per-IP throttles from one test cannot affect another.
 */
export function graphqlClient(api: TestApi, remoteAddress = uniqueIp()) {
  return async function request<T = Record<string, unknown>>(query: string, options: RequestOptions = {}): Promise<GraphqlResponse<T>> {
    const csrfToken = options.csrfToken === undefined ? options.session?.csrfToken : options.csrfToken;
    const response = await api.app.inject({
      headers: {
        "content-type": "application/json",
        origin: APP_ORIGIN,
        "x-csrf-request": "1",
        ...(options.session ? { cookie: `${SESSION_COOKIE}=${options.session.sessionToken}; ${CSRF_COOKIE}=${options.session.csrfToken}` } : {}),
        ...(csrfToken ? { "x-csrf-token": csrfToken } : {}),
      },
      method: "POST",
      payload: { query, variables: options.variables },
      remoteAddress,
      url: "/graphql",
    });
    const payload = response.json<{ data?: T | null; errors?: GraphqlError[] }>();
    const cookies = response.cookies as ResponseCookie[];
    const sessionToken = cookies.find((cookie) => cookie.name === SESSION_COOKIE && cookie.value)?.value;
    const csrfCookie = cookies.find((cookie) => cookie.name === CSRF_COOKIE && cookie.value)?.value;
    return {
      statusCode: response.statusCode,
      data: payload.data,
      errors: payload.errors,
      cookies,
      session: sessionToken && csrfCookie ? { sessionToken, csrfToken: csrfCookie } : undefined,
    };
  };
}

export const REGISTER = "mutation Register($input: CredentialsInput!) { register(input: $input) { viewer { id email role passwordSetupRequired onboardingCompleted } } }";
export const LOGIN = "mutation Login($input: CredentialsInput!) { login(input: $input) { viewer { id email role passwordSetupRequired onboardingCompleted } } }";
export const LOGOUT = "mutation Logout { logout { success } }";
export const SET_PASSWORD = "mutation SetPassword($input: SetPasswordInput!) { setPassword(input: $input) { viewer { id email passwordSetupRequired onboardingCompleted } } }";
export const VIEWER = "query Viewer { viewer { id email role passwordSetupRequired onboardingCompleted } }";

export type ViewerFields = { id: string; email: string; role: "USER" | "ADMIN"; passwordSetupRequired: boolean; onboardingCompleted: boolean };

export function uniqueEmail(label: string): string {
  return `${label}-${randomUUID()}@careerprofile.test`;
}

export function uniqueIp(): string {
  return `198.18.${randomInt(0, 256)}.${randomInt(1, 255)}`;
}

/** Inserts an account the way admin creation leaves it: no password, setup required. */
export async function insertSetupRequiredUser(database: AppDatabase, options: { onboardingCompleted: boolean }): Promise<{ id: string; email: string }> {
  const email = uniqueEmail("setup");
  const user = (await database.db.insert(users).values({
    email,
    normalizedEmail: email,
    onboardingCompletedAt: options.onboardingCompleted ? new Date() : null,
    passwordSetupRequired: true,
    role: "USER",
  }).returning())[0];
  if (!user) throw new Error("Could not insert the password-setup fixture.");
  await database.db.insert(userProfiles).values({ userId: user.id });
  return { id: user.id, email };
}

export async function completeOnboarding(database: AppDatabase, userId: string): Promise<void> {
  await database.db.update(users).set({ onboardingCompletedAt: new Date() }).where(eq(users.id, userId));
}
