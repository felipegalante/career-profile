import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordField, TextAreaField, TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label, marks required fields without reading the asterisk", () => {
    render(<TextField label="Company" isRequired />);
    const input = screen.getByRole("textbox", { name: "Company" });
    expect(input.getAttribute("aria-required")).toBe("true");
  });

  it("links error and helper text and marks the field invalid", () => {
    render(<TextField label="LinkedIn URL" description="Include https://" errorMessage="Enter a valid URL, including https://" />);
    const input = screen.getByRole("textbox", { name: "LinkedIn URL" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const descriptions = describedBy.map((id) => document.getElementById(id)?.textContent);
    expect(descriptions).toContain("Include https://");
    expect(descriptions).toContain("Enter a valid URL, including https://");
  });

  it("does not block form submission for empty required fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(<form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}><TextField label="Email" isRequired /><button type="submit">Send</button></form>);
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders a multi-line variant", () => {
    render(<TextAreaField label="Summary" />);
    expect(screen.getByRole("textbox", { name: "Summary" }).tagName).toBe("TEXTAREA");
  });
});

describe("PasswordField", () => {
  it("toggles visibility with an accessible button and keeps the value", async () => {
    const user = userEvent.setup();
    render(<PasswordField label="Password" />);
    const input = screen.getByLabelText("Password") as HTMLInputElement;
    await user.type(input, "ValidPassword!1");
    expect(input.type).toBe("password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(input.type).toBe("text");
    expect(input.value).toBe("ValidPassword!1");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(input.type).toBe("password");
  });

  it("keeps focus and the caret in the input when toggled with a pointer", async () => {
    const user = userEvent.setup();
    render(<PasswordField label="Verify password" />);
    const input = screen.getByLabelText("Verify password") as HTMLInputElement;
    await user.type(input, "abcdef");
    input.setSelectionRange(2, 2);
    await user.click(screen.getByRole("button", { name: "Show verify password" }));
    expect(document.activeElement).toBe(input);
    expect(input.selectionStart).toBe(2);
  });
});
