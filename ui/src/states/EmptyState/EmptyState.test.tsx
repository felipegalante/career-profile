import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";
import { FormErrorSummary } from "../FormErrorSummary/FormErrorSummary";
import { Button } from "../../primitives/Button/Button";

describe("EmptyState", () => {
  it("renders a heading, description and a single action", () => {
    render(<EmptyState icon="briefcase" title="No work experience yet" description="Add your first role to start building your professional history." action={<Button variant="primary">Add experience</Button>} />);
    expect(screen.getByRole("heading", { level: 3, name: "No work experience yet" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add experience" })).toBeTruthy();
  });

  it("supports other heading levels", () => {
    render(<EmptyState icon="close" tone="danger" title="Couldn’t load this section" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeTruthy();
  });
});

describe("FormErrorSummary", () => {
  it("renders nothing without a message", () => {
    const { container } = render(<FormErrorSummary>{null}</FormErrorSummary>);
    expect(container.childElementCount).toBe(0);
  });

  it("announces the message and receives focus", () => {
    render(<FormErrorSummary>We couldn’t save this record. Your entries are still here.</FormErrorSummary>);
    const alert = screen.getByRole("alert");
    expect(alert.textContent).toContain("Your entries are still here.");
    expect(document.activeElement).toBe(alert);
  });
});
