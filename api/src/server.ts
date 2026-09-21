import { createApp } from "./app.js";
import { loadRuntimeConfig } from "./config.js";
import { createDatabase, type AppDatabase } from "./db.js";

async function startServer(): Promise<void> {
  let database: AppDatabase | undefined;
  let app: ReturnType<typeof createApp> | undefined;
  let shuttingDown = false;

  const shutdown = async (exitCode: number): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;
    await app?.close();
    await database?.close();
    process.exitCode = exitCode;
  };

  try {
    const config = loadRuntimeConfig();
    database = createDatabase(config.databaseUrl);
    app = createApp({ database, verifyInstanceId: config.verifyInstanceId });
    for (const signal of ["SIGINT", "SIGTERM"] as const) {
      process.once(signal, () => {
        void shutdown(0);
      });
    }

    await app.listen({ host: config.host, port: config.port });
    const address = app.server.address();
    const port = typeof address === "object" && address ? address.port : config.port;
    console.log(JSON.stringify({ event: "api-listening", port, verifyInstanceId: config.verifyInstanceId }));
  } catch {
    app?.log.error({ safeErrorCode: "STARTUP_FAILED" }, "API startup failed");
    console.error(JSON.stringify({ event: "api-startup-failed", safeErrorCode: "STARTUP_FAILED" }));
    await shutdown(1);
  }
}

await startServer();
