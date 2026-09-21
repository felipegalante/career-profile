import Fastify from "fastify";
import { healthRoutes } from "./routes/health.routes.js";

export function createApp() {
  const app = Fastify({ logger: false });

  // Operational health endpoint only. Product/domain APIs will be GraphQL.
  app.register(healthRoutes);

  return app;
}
