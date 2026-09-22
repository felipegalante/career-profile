import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("foundation API", () => {
  it("reports liveness without a database and readiness only after a database ping", async () => {
    const app = createApp({
      ping: async () => {
        throw new Error("database password should not leak");
      },
    });

    try {
      const liveness = await app.inject({ method: "GET", url: "/livez" });
      const readiness = await app.inject({ method: "GET", url: "/readyz" });

      expect(liveness.statusCode).toBe(200);
      expect(liveness.json()).toEqual({ status: "ok" });
      expect(readiness.statusCode).toBe(503);
      expect(readiness.json()).toEqual({ status: "unavailable" });
      expect(readiness.body).not.toContain("password");
    } finally {
      await app.close();
    }
  });

  it("serves the minimal GraphQL schema with a request ID", async () => {
    const app = createApp({ ping: async () => {} });

    try {
      const response = await app.inject({
        headers: { "content-type": "application/json" },
        method: "POST",
        payload: { operationName: "FoundationPing", query: "query FoundationPing { ping }" },
        url: "/graphql",
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers["x-request-id"]).toEqual(expect.any(String));
      expect(response.json()).toEqual({ data: { ping: "pong" } });
    } finally {
      await app.close();
    }
  });

  it("rejects unsupported and malformed GraphQL requests without exposing internals", async () => {
    const app = createApp({ ping: async () => {} });

    try {
      const unsupported = await app.inject({
        headers: { "content-type": "text/plain" },
        method: "POST",
        payload: "query { ping }",
        url: "/graphql",
      });
      const malformed = await app.inject({
        headers: { "content-type": "application/json" },
        method: "POST",
        payload: "{",
        url: "/graphql",
      });

      expect(unsupported.statusCode).toBe(415);
      expect(unsupported.json().error).toBe("Unsupported media type");
      expect(malformed.statusCode).toBe(400);
      expect(malformed.json()).toMatchObject({ error: "Invalid request" });
      expect(malformed.body).not.toContain("Unexpected token");
    } finally {
      await app.close();
    }
  });

  it("rejects mutations that lack a trusted Origin and CSRF request marker", async () => {
    const app = createApp({ ping: async () => {} });
    try {
      const response = await app.inject({
        headers: { "content-type": "application/json" },
        method: "POST",
        payload: { query: "mutation Logout { logout { success } }" },
        url: "/graphql",
      });
      expect(response.statusCode).toBe(403);
      expect(response.json()).toMatchObject({ error: "Forbidden" });
    } finally {
      await app.close();
    }
  });

  it("masks unexpected resolver errors and includes the request ID in GraphQL errors", async () => {
    const app = createApp({
      ping: async () => {},
      pingResolver: () => {
        throw new Error("postgres://secret:password@database/internal");
      },
    });

    try {
      const response = await app.inject({
        headers: { "content-type": "application/json" },
        method: "POST",
        payload: { query: "{ ping }" },
        url: "/graphql",
      });
      const payload = response.json<{ errors: Array<{ extensions: { code: string; requestId: string }; message: string }> }>();

      expect(response.statusCode).toBe(200);
      expect(payload.errors[0]).toMatchObject({
        extensions: { code: "INTERNAL", requestId: response.headers["x-request-id"] },
        message: "Internal server error",
      });
      expect(response.body).not.toContain("postgres://");
    } finally {
      await app.close();
    }
  });

  it("preserves safe validation codes while attaching the request ID", async () => {
    const app = createApp({ ping: async () => {} });

    try {
      const response = await app.inject({
        headers: { "content-type": "application/json" },
        method: "POST",
        payload: { query: "{ unknownField }" },
        url: "/graphql",
      });
      const payload = response.json<{ errors: Array<{ extensions: { code: string; requestId: string } }> }>();

      expect(payload.errors[0]?.extensions).toEqual({
        code: "GRAPHQL_VALIDATION_FAILED",
        requestId: response.headers["x-request-id"],
      });
    } finally {
      await app.close();
    }
  });
});
