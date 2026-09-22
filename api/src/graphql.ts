import { createSchema, createYoga } from "graphql-yoga";
import type { AppDatabase } from "./db.js";
import { AuthService, type AuthSession, type Viewer } from "./auth/service.js";
import { authTypeDefs } from "./auth/schema.js";

export type AuthRuntime = { csrfCookieName: string; secureCookies: boolean; sessionCookieName: string; tokenHashSecret: string };
export type GraphqlServerContext = { cookies: Record<string, string | undefined>; ip: string; requestId: string; setCookies: string[] };
export type GraphqlContext = GraphqlServerContext & { auth: AuthService; database: AppDatabase; viewer: Viewer | null };

function serializeCookie(name: string, value: string, options: { httpOnly?: boolean; maxAge?: number; secure: boolean }): string {
  return [`${name}=${encodeURIComponent(value)}`, "Path=/", "SameSite=Lax", ...(options.httpOnly ? ["HttpOnly"] : []), ...(options.secure ? ["Secure"] : []), ...(options.maxAge !== undefined ? [`Max-Age=${options.maxAge}`] : [])].join("; ");
}

function setSessionCookies(context: GraphqlContext, session: AuthSession, runtime: AuthRuntime): void {
  const maxAge = Math.max(0, Math.floor((session.expiresAt.getTime() - Date.now()) / 1000));
  context.setCookies.push(serializeCookie(runtime.sessionCookieName, session.sessionToken, { httpOnly: true, maxAge, secure: runtime.secureCookies }));
  context.setCookies.push(serializeCookie(runtime.csrfCookieName, session.csrfToken, { maxAge, secure: runtime.secureCookies }));
}

function clearSessionCookies(context: GraphqlContext, runtime: AuthRuntime): void {
  context.setCookies.push(serializeCookie(runtime.sessionCookieName, "", { httpOnly: true, maxAge: 0, secure: runtime.secureCookies }));
  context.setCookies.push(serializeCookie(runtime.csrfCookieName, "", { maxAge: 0, secure: runtime.secureCookies }));
}

export function createFoundationYoga({ database, runtime, ping = () => "pong" }: { database: AppDatabase; runtime: AuthRuntime; ping?: () => string }) {
  const auth = new AuthService(database, runtime.tokenHashSecret);
  return createYoga<GraphqlServerContext, GraphqlContext>({
    batching: false, cors: false, graphiql: false, graphqlEndpoint: "/graphql", landingPage: false, logging: false,
    maskedErrors: { errorMessage: "Internal server error", isDev: false }, maxRequestBodySize: 1_048_576, multipart: false,
    schema: createSchema({
      resolvers: {
        Query: { ping, viewer: (_parent, _args, context: GraphqlContext) => context.viewer },
        Mutation: {
          register: async (_parent, { input }, context: GraphqlContext) => { const session = await context.auth.register(input, context.ip); setSessionCookies(context, session, runtime); return { viewer: session.viewer }; },
          login: async (_parent, { input }, context: GraphqlContext) => { const session = await context.auth.login(input, context.ip); setSessionCookies(context, session, runtime); return { viewer: session.viewer }; },
          logout: async (_parent, _args, context: GraphqlContext) => { await context.auth.logout(context.cookies[runtime.sessionCookieName]); clearSessionCookies(context, runtime); return { success: true }; },
          setPassword: async (_parent, { input }, context: GraphqlContext) => { const session = await context.auth.setPassword(input, context.ip); setSessionCookies(context, session, runtime); return { viewer: session.viewer }; },
        },
      },
      typeDefs: authTypeDefs,
    }),
    context: async (serverContext) => ({ ...serverContext, auth, database, viewer: await auth.viewerForToken(serverContext.cookies[runtime.sessionCookieName]) }),
  });
}
