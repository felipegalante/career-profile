import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { ToastProvider, useToast, type ToastOptions } from "./Toast";

function Trigger({ options }: { options: ToastOptions }) {
  const toast = useToast();
  return <button onClick={() => toast.show(options)}>Notify</button>;
}

/* Fake timers drive the toast lifetime; user-event cannot run under them, so events are dispatched directly. */
function showToast(options: ToastOptions) {
  render(<ToastProvider><Trigger options={options} /></ToastProvider>);
  fireEvent.click(screen.getByRole("button", { name: "Notify" }));
}

const advance = (ms: number) => act(() => vi.advanceTimersByTime(ms));

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] }));
  afterEach(() => vi.useRealTimers());

  it("announces success politely and hides after 2600 ms", () => {
    showToast({ title: "Skill added at Intermediate", description: "GraphQL is now in your profile." });
    expect(screen.getByRole("status").textContent).toContain("Skill added at Intermediate");
    advance(2599);
    expect(screen.queryByText("Skill added at Intermediate")).not.toBeNull();
    advance(1);
    expect(screen.queryByText("Skill added at Intermediate")).toBeNull();
  });

  it("announces danger toasts as alerts", () => {
    showToast({ tone: "danger", title: "This skill is already in your profile." });
    expect(screen.getByRole("alert").textContent).toContain("This skill is already in your profile.");
  });

  it("keeps action toasts for 8 s and runs the action once", () => {
    const onAction = vi.fn();
    showToast({ title: "TypeScript removed from your profile", action: { label: "Undo", onAction } });
    advance(7999);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("TypeScript removed from your profile")).toBeNull();
  });

  it("pauses the timer while hovered or focused and resumes with the remaining time", () => {
    showToast({ title: "Profile updated" });
    advance(1000);
    const toast = screen.getByText("Profile updated");
    fireEvent.pointerOver(toast);
    advance(10000);
    expect(screen.queryByText("Profile updated")).not.toBeNull();
    fireEvent.pointerOut(toast);
    fireEvent.focus(screen.getByRole("button", { name: "Dismiss notification" }));
    advance(10000);
    expect(screen.queryByText("Profile updated")).not.toBeNull();
    fireEvent.blur(screen.getByRole("button", { name: "Dismiss notification" }));
    advance(1599);
    expect(screen.queryByText("Profile updated")).not.toBeNull();
    advance(1);
    expect(screen.queryByText("Profile updated")).toBeNull();
  });

  it("can be dismissed early", () => {
    showToast({ title: "User created" });
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("User created")).toBeNull();
  });
});
