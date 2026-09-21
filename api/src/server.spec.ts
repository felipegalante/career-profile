import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { describe, expect, it } from "vitest";

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function runServer(environment: NodeJS.ProcessEnv): Promise<{ exitCode: number | null; output: string }> {
  const child = spawn(process.execPath, ["--import", "tsx", "src/server.ts"], {
    cwd: apiDirectory,
    env: { ...process.env, ...environment },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += String(chunk);
  });
  child.stderr.on("data", (chunk) => {
    output += String(chunk);
  });
  const [exitCode] = (await once(child, "exit")) as [number | null];
  return { exitCode, output };
}

describe("server startup", () => {
  it("reports configuration failures with a safe code", async () => {
    const result = await runServer({ DATABASE_URL: "https://secret.example.test" });

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('"safeErrorCode":"CONFIG_INVALID"');
    expect(result.output).not.toContain("secret.example.test");
  });

  it("reports listen failures with a safe code", async () => {
    const result = await runServer({
      DATABASE_URL: "postgres://user:password@127.0.0.1:1/career_profile",
      HOST: "203.0.113.1",
      PORT: "3001",
    });

    expect(result.exitCode).toBe(1);
    expect(result.output).toContain('"safeErrorCode":"LISTEN_FAILED"');
    expect(result.output).not.toContain("password");
  });
});
