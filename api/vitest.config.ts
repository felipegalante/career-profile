import { createRequire } from "node:module";
import { defineConfig } from "vitest/config";

const require = createRequire(import.meta.url);

export default defineConfig({
  resolve: {
    // Yoga recognizes application errors with `instanceof GraphQLError`. Vite would give source
    // files graphql's ESM build while Node gives externalized Yoga its CommonJS build, and the two
    // classes would make Yoga mask every AuthError code as INTERNAL. Production Node loads one copy.
    alias: [{ find: /^graphql$/, replacement: require.resolve("graphql") }],
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.spec.ts", "scripts/**/*.spec.ts"],
          exclude: ["**/*.db.spec.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "database",
          include: ["src/**/*.db.spec.ts"],
          globalSetup: ["./test/database-setup.ts"],
          // Argon2 hashing in several requests per test competes for CPU across parallel files.
          testTimeout: 20_000,
        },
      },
    ],
  },
});
