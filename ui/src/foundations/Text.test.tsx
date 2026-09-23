import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders the requested element so headings keep their semantics", () => {
    render(<Text as="h2" variant="section">Work experience</Text>);
    expect(screen.getByRole("heading", { level: 2, name: "Work experience" })).toBeTruthy();
  });

  it("defaults to an inline span", () => {
    const { container } = render(<Text variant="meta" tone="faint">Catalog</Text>);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
  });
});
