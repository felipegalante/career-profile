import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import type { ViewerQuery } from "../generated/graphql";

export type Viewer = NonNullable<ViewerQuery["viewer"]>;
type GraphqlError = { message: string; extensions?: { code?: string; fieldErrors?: Array<{ path: string; message: string }> } };
export class ApiError extends Error { constructor(readonly code: string, message: string, readonly fieldErrors: Record<string, string> = {}) { super(message); } }
let csrfCookieName: string | undefined;

function updateCsrfCookieName(value: string | null): void {
  if (value && /^[A-Za-z0-9_-]+$/.test(value)) csrfCookieName = value;
}

function csrfToken(): string | undefined {
  const entries = document.cookie.split("; ");
  const cookie = csrfCookieName
    ? entries.find((entry) => entry.startsWith(`${csrfCookieName}=`))
    : entries.find((entry) => entry.slice(0, entry.indexOf("=")).endsWith("_csrf"));
  return cookie?.split("=")[1];
}
export async function graphql<TData, TVariables>(operation: TypedDocumentNode<TData, TVariables>, variables?: TVariables, signal?: AbortSignal): Promise<TData> {
  const csrf = csrfToken();
  const response = await fetch("/graphql", { method: "POST", credentials: "include", signal, headers: { "content-type": "application/json", "x-csrf-request": "1", ...(csrf ? { "x-csrf-token": decodeURIComponent(csrf) } : {}) }, body: JSON.stringify({ query: print(operation), variables }) });
  updateCsrfCookieName(response.headers?.get?.("x-csrf-cookie-name") ?? null);
  const payload = (await response.json()) as { data?: TData; errors?: GraphqlError[] };
  const error = payload.errors?.[0];
  if (error) throw new ApiError(error.extensions?.code ?? "INTERNAL", error.message, Object.fromEntries((error.extensions?.fieldErrors ?? []).map((item) => [item.path, item.message])));
  if (!response.ok || !payload.data) throw new ApiError("NETWORK", "Could not reach Career Profile. Try again.");
  return payload.data;
}
