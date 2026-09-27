import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, Radio, RadioGroup } from "./Checkbox";

describe("Checkbox", () => {
  it("toggles with a click on its label and with Space", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Checkbox onChange={onChange}>I currently work here</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "I currently work here" });
    await user.click(screen.getByText("I currently work here"));
    expect((checkbox as HTMLInputElement).checked).toBe(true);
    await user.keyboard(" ");
    expect(onChange).toHaveBeenLastCalledWith(false);
  });
});

describe("RadioGroup", () => {
  it("moves the selection with arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RadioGroup label="Focus" defaultValue="primary" onChange={onChange}>
        <Radio value="primary">Primary focus</Radio>
        <Radio value="secondary">Secondary focus</Radio>
      </RadioGroup>
    );
    expect(screen.getByRole("radiogroup", { name: "Focus" })).toBeTruthy();
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(onChange).toHaveBeenCalledWith("secondary");
  });
});
