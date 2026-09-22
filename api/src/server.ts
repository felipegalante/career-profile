import { createApp } from "./app.js";
import { loadRuntimeConfig } from "./config.js";
import { createDatabase, type AppDatabase } from "./db.js";

type StartupStage = "application" | "configuration" | "database" | "listen";

function startupFailureCode(stage: StartupStage): string {
  switch (stage) {
    case "configuration":
      return "CONFIG_INVALID";
    case "database":
      return "DATABASE_INITIALIZATION_FAILED";
    case "listen":
      return "LISTEN_FAILED";
    case "application":
      return "APPLICATION_INITIALIZATION_FAILED";
  }
}

async function startServer(): Promise<void> {
  let database: AppDatabase | undefined;
  let app: ReturnType<typeof createApp> | undefined;
  let shuttingDown = false;
  let stage: StartupStage = "configuration";

  const shutdown = async (exitCode: number): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    await app?.close();
    await database?.close();
    process.exitCode = exitCode;
  };

  try {
    const config = loadRuntimeConfig();
    stage = "database";
    database = createDatabase(config.databaseUrl);
    stage = "application";
    app = createApp({ appOrigin: config.appOrigin, database, sessionCookieName: config.sessionCookieName, sessionSecret: config.sessionSecret, trustProxy: config.trustProxy, verifyInstanceId: config.verifyInstanceId });
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.once(signal, () => {
        void shutdown(0);
      });
    }

    stage = "listen";
    await app.listen({ host: config.host, port: config.port });
    const address = app.server.address();
    const port = typeof address === "object" && address ? address.port : config.port;
    console.log(JSON.stringify({ event: "api-listening", port, verifyInstanceId: config.verifyInstanceId }));
  } catch {
    const safeErrorCode = startupFailureCode(stage);
    app?.log.error({ safeErrorCode }, "API startup failed");
    console.error(JSON.stringify({ event: "api-startup-failed", safeErrorCode }));
    await shutdown(1);
  }
}

await startServer();
