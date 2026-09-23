import { defineConfig, devices } from "@playwright/test";

const dragSpec = /skills-drag\.spec\.ts/;

/*
 * Screenshot baselines are rendered on Linux in CI only (font rasterization differs by OS), so the
 * visual project runs only when VISUAL=1, as in the `test:visual` script and the CI visual job.
 */
const visualProject = { name: "visual", use: { ...devices["Desktop Chrome"] }, grep: /@visual/ };

export default defineConfig({
  testDir: "./e2e",
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  use: { baseURL: "http://localhost:5173" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] }, grepInvert: /@visual/ },
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: dragSpec },
    { name: "webkit", use: { ...devices["Desktop Safari"] }, testMatch: dragSpec },
    ...(process.env.VISUAL ? [visualProject] : []),
  ],
  webServer: { command: "pnpm dev", port: 5173, reuseExistingServer: !process.env.CI },
});
