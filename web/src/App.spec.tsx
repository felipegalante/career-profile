import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.history.pushState({}, "", "/register");
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ data: { viewer: null } }) })));
});

describe("authentication screens", () => {
  it("renders accessible password visibility controls and blocks mismatched confirmation", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Start your Career Profile" })).toBeTruthy();
    const password = screen.getByLabelText("Password");
    fireEvent.change(password, { target: { value: "ValidPassword!1" } });
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect((password as HTMLInputElement).type).toBe("text");
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("Passwords do not match.")).toBeTruthy();
  });
});
