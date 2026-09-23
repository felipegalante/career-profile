import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type FormEvent } from "react";
import { ProfileRecordDialog } from "./ProfileRecordDialog";
import { TextField } from "../../primitives/TextField/TextField";

function Harness({ onSubmit = vi.fn(), onOpenChange = vi.fn(), isSaving = false, errorMessage }: { onSubmit?: (event: FormEvent<HTMLFormElement>) => void; onOpenChange?: (open: boolean) => void; isSaving?: boolean; errorMessage?: string }) {
  return (
    <ProfileRecordDialog title="Add work experience" isOpen onOpenChange={onOpenChange} onSubmit={(event) => { event.preventDefault(); onSubmit(event); }} isSaving={isSaving} errorMessage={errorMessage}>
      <TextField label="Company" isRequired />
      <TextField label="Start Date" placeholder="Month / Year" />
    </ProfileRecordDialog>
  );
}

describe("ProfileRecordDialog", () => {
  it("submits the form from the Save button", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("closes from Cancel", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Harness onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("blocks duplicate submission and dismissal while saving", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onOpenChange = vi.fn();
    render(<Harness isSaving onSubmit={onSubmit} onOpenChange={onOpenChange} />);
    const save = screen.getByRole("button", { name: "Saving…" });
    await user.click(save);
    await user.type(screen.getByRole("textbox", { name: "Company" }), "{Enter}");
    await user.keyboard("{Escape}");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect((screen.getByRole("button", { name: "Cancel" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("shows a recoverable error without clearing the entered values", async () => {
    const user = userEvent.setup();
    function Failing() {
      const [error, setError] = useState<string>();
      return (
        <ProfileRecordDialog title="Add work experience" isOpen onOpenChange={() => undefined} onSubmit={(event) => { event.preventDefault(); setError("We couldn’t save this record. Your entries are still here."); }} errorMessage={error}>
          <TextField label="Company" />
        </ProfileRecordDialog>
      );
    }
    render(<Failing />);
    await user.type(screen.getByRole("textbox", { name: "Company" }), "Shopify");
    await user.click(screen.getByRole("button", { name: "Save" }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Your entries are still here.");
    await waitFor(() => expect(document.activeElement).toBe(alert));
    expect((screen.getByRole("textbox", { name: "Company" }) as HTMLInputElement).value).toBe("Shopify");
  });
});
