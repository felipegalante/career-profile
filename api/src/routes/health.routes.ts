import type { FastifyPluginAsync } from "fastify";

export const healthRoutes = ({
  ping,
  verifyInstanceId,
}: {
  ping: () => Promise<void>;
  verifyInstanceId?: string;
}): FastifyPluginAsync =>
  async (app) => {
    app.get("/livez", async () => ({ status: "ok" }));

    app.get("/readyz", async (_request, reply) => {
      try {
        await ping();
        return { status: "ok", ...(verifyInstanceId ? { instanceId: verifyInstanceId } : {}) };
      } catch {
        app.log.warn({ safeErrorCode: "DATABASE_UNAVAILABLE" }, "Database readiness check failed");
        return reply.status(503).send({ status: "unavailable" });
      }
    });
  };
