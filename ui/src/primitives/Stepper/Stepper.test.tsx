import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper } from "./Stepper";
import { Avatar, initialsFor } from "../Avatar/Avatar";
import { ProgressBar } from "../Progress/Progress";

describe("Stepper", () => {
  it("marks the current step and names every step", () => {
    render(<Stepper steps={["Basics", "Career context", "Professional focus", "Skills"]} current={2} />);
    const list = screen.getByRole("list", { name: "Setup progress" });
    expect(list.querySelectorAll("li:not([aria-hidden])")).toHaveLength(4);
    expect(screen.getByText("Career context, current").closest("li")?.getAttribute("aria-current")).toBe("step");
    expect(screen.getByText("Basics, completed")).toBeTruthy();
    expect(screen.getByText("Skills, upcoming")).toBeTruthy();
  });
});

describe("Avatar", () => {
  it("derives initials from the first and last name", () => {
    expect(initialsFor("Maya Chen")).toBe("MC");
    expect(initialsFor("  alex  de la rivera ")).toBe("AR");
    expect(initialsFor("Prince")).toBe("P");
    const { container } = render(<Avatar name="Maya Chen" />);
    expect(container.textContent).toBe("MC");
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("ProgressBar", () => {
  it("exposes the value to assistive technology", () => {
    render(<ProgressBar aria-label="Profile completeness" value={82} />);
    const bar = screen.getByRole("progressbar", { name: "Profile completeness" });
    expect(bar.getAttribute("aria-valuenow")).toBe("82");
  });
});
