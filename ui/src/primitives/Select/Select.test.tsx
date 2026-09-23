import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const employmentTypes = [
  { id: "FULL_TIME", label: "Full-time" },
  { id: "PART_TIME", label: "Part-time" },
  { id: "CONTRACT", label: "Contract" },
];

describe("Select", () => {
  it("opens a labelled listbox and reports the chosen option", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Employment Type" placeholder="Select type" items={employmentTypes} onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: /Employment Type/ });
    expect(trigger.textContent).toContain("Select type");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeTruthy();
    await user.click(screen.getByRole("option", { name: "Contract" }));
    expect(onChange).toHaveBeenCalledWith("CONTRACT");
    expect(trigger.textContent).toContain("Contract");
  });

  it("supports keyboard selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select label="Employment Type" items={employmentTypes} defaultValue="FULL_TIME" onChange={onChange} />);
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Full-time" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith("PART_TIME");
  });
});
