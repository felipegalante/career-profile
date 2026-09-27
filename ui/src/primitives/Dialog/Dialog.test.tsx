import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Dialog, DialogTrigger, isBlockingDialogOpen } from "./Dialog";
import { Button } from "../Button/Button";
import { TextField } from "../TextField/TextField";

function Example({ isPending = false, onSave = () => undefined }: { isPending?: boolean; onSave?: () => void }) {
  return (
    <DialogTrigger>
      <Button>Add experience</Button>
      <Dialog title="Add work experience" isPending={isPending} footer={<><Button slot="close">Cancel</Button><Button variant="primary" onPress={onSave} isPending={isPending}>Save</Button></>}>
        <TextField label="Company" />
      </Dialog>
    </DialogTrigger>
  );
}

describe("Dialog", () => {
  it("opens as a labelled modal, moves focus inside and marks itself as blocking", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Add experience" }));
    const dialog = screen.getByRole("dialog", { name: "Add work experience" });
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(isBlockingDialogOpen()).toBe(true);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole("button", { name: "Add experience" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(trigger));
    expect(isBlockingDialogOpen()).toBe(false);
  });

  it("closes from the close button and from Cancel", async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Add experience" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Add experience" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("cannot be dismissed while a save is pending", async () => {
    const user = userEvent.setup();
    render(<Example isPending />);
    await user.click(screen.getByRole("button", { name: "Add experience" }));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return <Dialog title="Reset password" isOpen={open} onOpenChange={(next) => { onOpenChange(next); setOpen(next); }}>Body</Dialog>;
    }
    render(<Controlled />);
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
