import { defineConfig, devices } from "@playwright/test";
import { E2E_API_ENV, E2E_API_PORT, E2E_WEB_ORIGIN } from "./e2e/support/api";

const dragSpec = /skills-drag\.spec\.ts/;

/*
 * Screenshot baselines are rendered on Linux in CI only (font rasterization differs by OS), so the
 * visual project runs only when VISUAL=1, as in the `test:visual` script and the CI visual job.
 * Visual tests mock GraphQL, so those runs start no API and need no database.
 */
const visualProject = { name: "visual", use: { ...devices["Desktop Chrome"] }, grep: /@visual/ };

const apiServer = {
  command: "node --import tsx test/e2e-server.ts",
  cwd: "../api",
  env: E2E_API_ENV,
  // Each run starts its own API so the browser-test database is recreated.
  reuseExistingServer: false,
  url: `http://127.0.0.1:${E2E_API_PORT}/readyz`,
};

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  use: { baseURL: E2E_WEB_ORIGIN },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@visual/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: dragSpec },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: dragSpec },
    ...(process.env.VISUAL ? [visualProject] : []),
  ],
  webServer: [
    {
      command: `pnpm dev --port ${new URL(E2E_WEB_ORIGIN).port} --strictPort`,
      env: { API_PROXY_TARGET: `http://127.0.0.1:${E2E_API_PORT}` },
      reuseExistingServer: !process.env.CI,
      url: E2E_WEB_ORIGIN,
    },
    ...(process.env.VISUAL ? [] : [apiServer]),
  ],
});
