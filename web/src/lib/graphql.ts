export type Viewer = { id: string; email: string; role: "USER" | "ADMIN"; passwordSetupRequired: boolean; onboardingCompleted: boolean };
type GraphqlError = { message: string; extensions?: { code?: string; fieldErrors?: Array<{ path: string; message: string }> } };
export class ApiError extends Error { constructor(readonly code: string, message: string, readonly fieldErrors: Record<string, string> = {}) { super(message); } }
function csrfToken(): string | undefined { return document.cookie.split("; ").find((entry) => entry.startsWith("career_profile_session_csrf="))?.split("=")[1]; }
export async function graphql<T>(query: string, variables?: Record<string, unknown>, signal?: AbortSignal): Promise<T> {
  const csrf = csrfToken();
  const response = await fetch("/graphql", { method: "POST", credentials: "include", signal, headers: { "content-type": "application/json", "x-csrf-request": "1", ...(csrf ? { "x-csrf-token": decodeURIComponent(csrf) } : {}) }, body: JSON.stringify({ query, variables }) });
  const payload = (await response.json()) as { data?: T; errors?: GraphqlError[] };
  const error = payload.errors?.[0];
  if (error) throw new ApiError(error.extensions?.code ?? "INTERNAL", error.message, Object.fromEntries((error.extensions?.fieldErrors ?? []).map((item) => [item.path, item.message])));
  if (!response.ok || !payload.data) throw new ApiError("NETWORK", "Could not reach Career Profile. Try again.");
  return payload.data;
}
export const viewerOperation = "query Viewer { viewer { id email role passwordSetupRequired onboardingCompleted } }";
export const registerOperation = "mutation Register($input: CredentialsInput!) { register(input: $input) { viewer { id email role passwordSetupRequired onboardingCompleted } } }";
export const loginOperation = "mutation Login($input: CredentialsInput!) { login(input: $input) { viewer { id email role passwordSetupRequired onboardingCompleted } } }";
export const logoutOperation = "mutation Logout { logout { success } }";
export const setPasswordOperation = "mutation SetPassword($input: SetPasswordInput!) { setPassword(input: $input) { viewer { id email role passwordSetupRequired onboardingCompleted } } }";
