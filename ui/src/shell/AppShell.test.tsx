import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppShell, type AppShellProps } from "./AppShell";
import { PageHeader } from "./PageHeader";
import { isModifierShortcut } from "./useShellShortcuts";
import { Dialog } from "../primitives/Dialog/Dialog";
import { Button } from "../primitives/Button/Button";

const onProfileCommand = vi.fn();

const props: Omit<AppShellProps, "children"> = {
  navigation: [{ id: "profile", label: "My profile", items: [{ id: "profile", label: "Profile", icon: "home", href: "/profile" }, { id: "focus", label: "Professional Focus", icon: "target", href: "/profile/focus" }] }],
  currentItemId: "profile",
  account: { name: "Maya Chen", subtitle: "Vancouver, BC", actions: [{ id: "account", label: "Profile", icon: "user", href: "/account" }, { id: "settings", label: "Settings", icon: "settings", href: "/account?tab=settings" }, { id: "sign-out", label: "Sign out", icon: "sign-out", tone: "danger", separated: true, onAction: () => undefined }] },
  commands: [
    { id: "go-profile", label: "Profile", description: "Go to your Profile workspace", group: "Navigation", icon: "home", onAction: onProfileCommand },
    { id: "go-focus", label: "Professional Focus", group: "Navigation", icon: "target", onAction: () => undefined },
    { id: "add-experience", label: "Add work experience", group: "Profile actions", icon: "plus", onAction: () => undefined },
  ],
};

function renderShell(children = <PageHeader title="Skills" description="Organize the skills that best represent your profile" />) {
  return render(<AppShell {...props}>{children}</AppShell>);
}

const press = (key: string, init: KeyboardEventInit = {}) => fireEvent.keyDown(document.activeElement ?? document.body, { key, ...init });

describe("AppShell", () => {
  it("renders primary navigation with the current page marked", () => {
    renderShell();
    const nav = screen.getAllByRole("navigation", { name: "Primary" })[0];
    expect(nav.querySelector('[aria-current="page"]')?.textContent).toBe("Profile");
  });

  it("toggles the rail with Cmd+B and Ctrl+B without remounting page content", async () => {
    const user = userEvent.setup();
    renderShell(<><PageHeader title="Skills" /><label>Notes<input /></label></>);
    const input = screen.getByLabelText("Notes") as HTMLInputElement;
    await user.type(input, "draft");
    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    press("b", { metaKey: true });
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    press("b", { ctrlKey: true });
    expect(toggle.getAttribute("aria-expanded")).toBe("true");
    expect((screen.getByLabelText("Notes") as HTMLInputElement).value).toBe("draft");
  });

  it("keeps link names while collapsed", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Toggle navigation" }));
    expect(screen.getAllByRole("link", { name: "Professional Focus" }).length).toBeGreaterThan(0);
  });

  it("leaves Cmd+B to contenteditable editors", () => {
    renderShell(<><PageHeader title="Notes" /><div contentEditable suppressContentEditableWarning data-testid="editor">Rich text</div></>);
    const editor = screen.getByTestId("editor");
    editor.focus();
    const event = new KeyboardEvent("keydown", { key: "b", metaKey: true, bubbles: true, cancelable: true });
    editor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByRole("button", { name: "Toggle navigation" }).getAttribute("aria-expanded")).toBe("true");
  });

  it("opens the palette with Cmd+K, focuses its search and restores focus on Escape", async () => {
    const user = userEvent.setup();
    renderShell(<><PageHeader title="Skills" /><Button>Start</Button></>);
    const start = screen.getByRole("button", { name: "Start" });
    start.focus();
    const event = new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true, cancelable: true });
    start.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    const search = await screen.findByRole("searchbox", { name: "Search pages and actions" }).catch(() => screen.getByRole("textbox", { name: "Search pages and actions" }));
    await waitFor(() => expect(document.activeElement).toBe(search));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Command palette" })).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(start));
  });

  it("does not open the palette over a blocking dialog", () => {
    renderShell(<Dialog title="Add work experience" isOpen onOpenChange={() => undefined}>Form</Dialog>);
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true, cancelable: true });
    document.body.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole("dialog", { name: "Command palette" })).toBeNull();
  });

  it("filters commands, runs the active one with Enter and closes", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Search or run a command" }));
    await user.keyboard("pro");
    expect(screen.queryByRole("menuitem", { name: /Add work experience/ })).toBeNull();
    await user.keyboard("{Enter}");
    expect(onProfileCommand).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Command palette" })).toBeNull());
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: "Search or run a command" }));
    await user.keyboard("zzz");
    expect(screen.getByText("No matching commands")).toBeTruthy();
  });

  it("exposes shortcut metadata on the visible controls", () => {
    renderShell();
    expect(screen.getByRole("button", { name: "Search or run a command" }).getAttribute("aria-keyshortcuts")).toBe("Meta+K Control+K");
    expect(screen.getByRole("button", { name: "Toggle navigation" }).getAttribute("aria-keyshortcuts")).toBe("Meta+B Control+B");
  });

  it("opens the account menu from the account button", async () => {
    const user = userEvent.setup();
    renderShell();
    await user.click(screen.getByRole("button", { name: /Maya Chen/ }));
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeTruthy();
  });
});

describe("PageHeader", () => {
  it("omits shell controls outside AppShell and renders the back link", () => {
    render(<PageHeader title="Work experience" backLink={{ href: "/profile" }} />);
    expect(screen.getByRole("heading", { level: 1, name: "Work experience" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to Profile" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Toggle navigation" })).toBeNull();
  });
});

describe("isModifierShortcut", () => {
  it("ignores Alt and Shift combinations", () => {
    expect(isModifierShortcut(new KeyboardEvent("keydown", { key: "k", metaKey: true }), "k")).toBe(true);
    expect(isModifierShortcut(new KeyboardEvent("keydown", { key: "K", ctrlKey: true, shiftKey: true }), "k")).toBe(false);
    expect(isModifierShortcut(new KeyboardEvent("keydown", { key: "b", altKey: true, metaKey: true }), "b")).toBe(false);
    expect(isModifierShortcut(new KeyboardEvent("keydown", { key: "b" }), "b")).toBe(false);
  });
});
