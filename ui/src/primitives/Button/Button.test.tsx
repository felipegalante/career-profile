import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import { Icon } from "../../foundations/Icon";

describe("Button", () => {
  it("responds to pointer and keyboard presses", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button variant="primary" onPress={onPress}>Save changes</Button>);
    await user.click(screen.getByRole("button", { name: "Save changes" }));
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(2);
  });

  it("keeps a pending button focusable but ignores presses", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button variant="primary" isPending onPress={onPress}>Saving…</Button>);
    const button = screen.getByRole("button", { name: /Saving/ });
    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("does not respond when disabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<Button isDisabled onPress={onPress}>Remove</Button>);
    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("names icon-only buttons through aria-label", () => {
    render(<Button variant="ghost" isIconOnly aria-label="Close"><Icon name="close" /></Button>);
    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
  });
});
