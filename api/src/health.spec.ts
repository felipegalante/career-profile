import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("api", () => {
  it("serves the operational health endpoint", async () => {
    const app = createApp();
    try {
      const response = await app.inject({ method: "GET", url: "/healthz" });
      const body = response.json<{ api: string }>();
      expect(response.statusCode).toBe(200);
      expect(body.api).toBe("ok");
    } finally {
      await app.close();
    }
  });
});
