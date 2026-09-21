import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import type { AppDatabase } from "./db.js";
import { createFoundationYoga } from "./graphql.js";
import { healthRoutes } from "./routes/health.routes.js";

const jsonContentType = /^application\/json(?:;|$)/i;

type CreateAppOptions = {
  database?: AppDatabase;
  ping?: () => Promise<void>;
  pingResolver?: () => string;
  verifyInstanceId?: string;
};

function unavailableDatabase(): AppDatabase {
  return {
    db: undefined as never,
    close: async () => {},
    ping: async () => {
      throw new Error("Database is not configured.");
    },
  };
}

export function createApp(options: CreateAppOptions = {}) {
  const database = options.database ?? unavailableDatabase();
  const ping = options.ping ?? database.ping;
  const yoga = createFoundationYoga({ database, ping: options.pingResolver });
  const app = Fastify({
    bodyLimit: 1_048_576,
    genReqId: () => randomUUID(),
    logger: {
      level: "info",
      redact: {
        censor: "[REDACTED]",
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "req.body.password",
          "req.body.variables.password",
          "req.body.variables.grant",
          "res.headers.set-cookie",
        ],
      },
    },
    requestIdHeader: false,
  });

  app.addHook("onRequest", async (_request, reply) => {
    reply.header("x-request-id", reply.request.id);
  });

  app.setErrorHandler((error, request, reply) => {
    const errorStatusCode =
      error && typeof error === "object" && "statusCode" in error && typeof error.statusCode === "number"
        ? error.statusCode
        : undefined;
    const statusCode = errorStatusCode && errorStatusCode < 500 ? errorStatusCode : 500;
    request.log.error({ safeErrorCode: statusCode === 500 ? "INTERNAL" : "BAD_REQUEST" }, "Request failed");
    reply.status(statusCode).send({
      error: statusCode === 500 ? "Internal server error" : "Invalid request",
      requestId: request.id,
    });
  });

  app.register(healthRoutes({ ping, verifyInstanceId: options.verifyInstanceId }));
  app.post("/graphql", async (request, reply) => {
    const contentType = request.headers["content-type"];
    if (!contentType || !jsonContentType.test(contentType)) {
      return reply.status(415).send({ error: "Unsupported media type", requestId: request.id });
    }

    const startedAt = performance.now();
    const response = await yoga.fetch(
      new URL(request.url, `http://${request.headers.host ?? "localhost"}`),
      {
        body: JSON.stringify(request.body),
        headers: request.headers as Record<string, string>,
        method: "POST",
      },
      { requestId: request.id }
    );
    const body = await response.text();
    const responseBody = appendRequestId(body, request.id);
    const errorCode = errorCodeFromGraphqlResponse(responseBody);

    for (const [name, value] of response.headers) {
      reply.header(name, value);
    }
    request.log.info(
      {
        graphqlDurationMs: Math.round((performance.now() - startedAt) * 100) / 100,
        graphqlErrorCode: errorCode,
        graphqlOperation: operationNameFromBody(request.body),
      },
      "GraphQL operation completed"
    );
    return reply.status(response.status).type("application/json; charset=utf-8").send(responseBody);
  });

  return app;
}

function operationNameFromBody(body: unknown): string {
  if (body && typeof body === "object" && "operationName" in body) {
    const operationName = (body as { operationName?: unknown }).operationName;
    if (typeof operationName === "string" && operationName) return operationName;
  }

  return "anonymous";
}

function errorCodeFromGraphqlResponse(body: string): string {
  try {
    const payload = JSON.parse(body) as { errors?: Array<{ extensions?: { code?: unknown } }> };
    const code = payload.errors?.[0]?.extensions?.code;
    return typeof code === "string" ? code : payload.errors?.length ? "GRAPHQL_ERROR" : "OK";
  } catch {
    return "INVALID_RESPONSE";
  }
}

function appendRequestId(body: string, requestId: string): string {
  try {
    const payload = JSON.parse(body) as { errors?: Array<{ extensions?: Record<string, unknown> }> };
    if (!payload.errors) return body;

    for (const error of payload.errors) {
      const originalCode = error.extensions?.code;
      error.extensions = {
        ...error.extensions,
        code: originalCode && originalCode !== "INTERNAL_SERVER_ERROR" ? originalCode : "INTERNAL",
        requestId,
      };
    }
    return JSON.stringify(payload);
  } catch {
    return body;
  }
}
