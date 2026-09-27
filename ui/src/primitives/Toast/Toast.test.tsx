import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
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
/** The visible stack; announcer copies of the same text live outside it. */
const stack = () => within(screen.getByRole("region", { name: "Notifications" }));

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "Date"] }));
  afterEach(() => vi.useRealTimers());

  it("announces success politely and hides after 2600 ms", () => {
    showToast({ title: "Skill added at Intermediate", description: "GraphQL is now in your profile." });
    expect(screen.getByRole("status").textContent).toContain("Skill added at Intermediate");
    advance(2599);
    expect(stack().queryByText("Skill added at Intermediate")).not.toBeNull();
    advance(1);
    expect(stack().queryByText("Skill added at Intermediate")).toBeNull();
  });

  it("mounts empty live regions before any toast so the first one is announced", () => {
    render(<ToastProvider><Trigger options={{ title: "Profile updated" }} /></ToastProvider>);
    expect(screen.getByRole("status").textContent).toBe("");
    expect(screen.getByRole("alert").textContent).toBe("");
  });

  it("stacks toasts in arrival order and keeps their controls out of the live regions", () => {
    function Triggers() {
      const toast = useToast();
      return (
        <>
          <button onClick={() => toast.show({ title: "Skill added" })}>Success</button>
          <button onClick={() => toast.show({ tone: "danger", title: "Could not save" })}>Danger</button>
          <button onClick={() => toast.show({ title: "TypeScript removed", action: { label: "Undo", onAction: () => undefined } })}>Undo</button>
        </>
      );
    }
    render(<ToastProvider><Triggers /></ToastProvider>);
    for (const name of ["Success", "Danger", "Undo"]) fireEvent.click(screen.getByRole("button", { name }));
    const titles = Array.from(screen.getByRole("region", { name: "Notifications" }).querySelectorAll("b"), (node) => node.textContent);
    expect(titles).toEqual(["Skill added", "Could not save", "TypeScript removed"]);
    const announced = (role: "status" | "alert") => Array.from(screen.getByRole(role).children, (node) => node.textContent);
    expect(announced("status")).toEqual(["Skill added", "TypeScript removed"]);
    expect(announced("alert")).toEqual(["Could not save"]);
    expect(stack().getByRole("button", { name: "Undo" })).toBeTruthy();
    expect(stack().getAllByRole("button", { name: "Dismiss notification" })).toHaveLength(3);
    expect(within(screen.getByRole("status")).queryByRole("button")).toBeNull();
    expect(within(screen.getByRole("alert")).queryByRole("button")).toBeNull();
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
    expect(stack().queryByText("TypeScript removed from your profile")).toBeNull();
  });

  it("pauses the timer while hovered or focused and resumes with the remaining time", () => {
    showToast({ title: "Profile updated" });
    advance(1000);
    const toast = stack().getByText("Profile updated");
    fireEvent.pointerOver(toast);
    advance(10000);
    expect(stack().queryByText("Profile updated")).not.toBeNull();
    fireEvent.pointerOut(toast);
    fireEvent.focus(screen.getByRole("button", { name: "Dismiss notification" }));
    advance(10000);
    expect(stack().queryByText("Profile updated")).not.toBeNull();
    fireEvent.blur(screen.getByRole("button", { name: "Dismiss notification" }));
    advance(1599);
    expect(stack().queryByText("Profile updated")).not.toBeNull();
    advance(1);
    expect(stack().queryByText("Profile updated")).toBeNull();
  });

  it("can be dismissed early", () => {
    showToast({ title: "User created" });
    fireEvent.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(stack().queryByText("User created")).toBeNull();
  });
});
