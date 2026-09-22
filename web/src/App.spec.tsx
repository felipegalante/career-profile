import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  window.history.pushState({}, "", "/register");
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ data: { viewer: null } }) })));
});

afterEach(() => {
  cleanup();
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

  it("keeps the user on a retryable bootstrap error when viewer transport fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new TypeError("network unavailable"); }));
    render(<App />);
    expect(await screen.findByRole("heading", { name: "Could not restore your session" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Start your Career Profile" })).toBeNull();
  });

  it("preserves a registration form after a transport error", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, headers: new Headers(), json: async () => ({ data: { viewer: null } }) })
      .mockRejectedValueOnce(new TypeError("network unavailable"));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);
    const email = await screen.findByLabelText("Email");
    fireEvent.change(email, { target: { value: "alex@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "ValidPassword!1" } });
    fireEvent.change(screen.getByLabelText("Verify password"), { target: { value: "ValidPassword!1" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByText("Could not reach Career Profile. Try again.")).toBeTruthy();
    expect((email as HTMLInputElement).value).toBe("alex@example.test");
  });
});
