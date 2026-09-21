import { spawn } from "node:child_process";
import { once } from "node:events";
import { describe, expect, it } from "vitest";
import { waitForApiStart } from "./verify.js";

describe("verification API lifecycle", () => {
  it("terminates its child when startup times out", async () => {
    const child = spawn(process.execPath, ["-e", "setInterval(() => {}, 1_000)"], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    await expect(waitForApiStart(child, 25)).rejects.toThrow("Timed out waiting for the verification API to start.");
    if (child.exitCode === null && child.signalCode === null) await once(child, "exit");

    expect(child.exitCode !== null || child.signalCode !== null).toBe(true);
  });
});
