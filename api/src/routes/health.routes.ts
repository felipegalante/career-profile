import type { FastifyPluginAsync } from "fastify";
import { pingDatabase } from "../db.js";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/healthz", async () => {
    let db = "ok";
    try {
      await pingDatabase();
    } catch (error) {
      db = `error: ${error instanceof Error ? error.message : String(error)}`;
    }

    return { api: "ok", db };
  });
};
