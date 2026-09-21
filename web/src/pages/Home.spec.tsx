import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ json: async () => ({ status: "ok" }) }))
  );
});

describe("Home", () => {
  it("renders the project scaffold", async () => {
    render(<Home />);
    expect(await screen.findByText(/Career Profile/)).toBeTruthy();
  });
});
