import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // The token parity test reads raw stylesheets; Vitest otherwise replaces CSS imports with empty strings.
    css: { include: [/foundations\/tokens\.css/, /artifacts\/assets\/styles\.css/], modules: { classNameStrategy: "non-scoped" } },
  },
});
