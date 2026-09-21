import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (endpoint: string) => ({
      json: async () => ({ status: endpoint === "/livez" ? "ok" : "unavailable" }),
      ok: endpoint === "/livez",
    }))
  );
});

describe("Home", () => {
  it("reports API liveness separately from database readiness", async () => {
    render(<Home />);
    expect(await screen.findByText(/Career Profile/)).toBeTruthy();
    expect(fetch).toHaveBeenCalledWith("/livez");
    expect(fetch).toHaveBeenCalledWith("/readyz");
    expect(screen.getByText("API host").parentElement?.textContent).toContain("✓");
    expect(screen.getByText("Database").parentElement?.textContent).toContain("✗");
  });
});
