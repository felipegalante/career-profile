import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Icon, iconNames } from "./Icon";

describe("Icon", () => {
  it.each(iconNames)("renders %s as a decorative 24-unit glyph", (name) => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg?.childElementCount).toBeGreaterThan(0);
  });

  it("stays hidden from assistive technology even when a caller passes aria attributes", () => {
    const { container } = render(<Icon name="check" size={16} strokeWidth={2} aria-hidden={false} />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("width")).toBe("16");
    expect(svg?.getAttribute("stroke-width")).toBe("2");
  });
});
