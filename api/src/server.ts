import { createApp } from "./app.js";
import { loadRuntimeConfig } from "./config.js";
import { createDatabase } from "./db.js";

const config = loadRuntimeConfig();
const database = createDatabase(config.databaseUrl);
const app = createApp({ database, verifyInstanceId: config.verifyInstanceId });
let shuttingDown = false;

async function shutdown(exitCode: number): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  await app.close();
  await database.close();
  process.exitCode = exitCode;
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.once(signal, () => {
    void shutdown(0);
  });
}

try {
  await app.listen({ host: config.host, port: config.port });
  const address = app.server.address();
  const port = typeof address === "object" && address ? address.port : config.port;
  console.log(JSON.stringify({ event: "api-listening", port, verifyInstanceId: config.verifyInstanceId }));
} catch {
  app.log.error({ safeErrorCode: "STARTUP_FAILED" }, "API startup failed");
  await shutdown(1);
}
