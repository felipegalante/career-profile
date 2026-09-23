import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SkillBoard, type Proficiency, type SkillCategoryData } from "./Skills";

const categories: SkillCategoryData[] = [
  {
    category: "TECHNICAL",
    lanes: [
      { level: "ADVANCED", skills: [{ id: "typescript", label: "TypeScript" }, { id: "system-design", label: "System Design" }] },
      { level: "INTERMEDIATE", skills: [{ id: "react", label: "React" }, { id: "postgresql", label: "PostgreSQL" }, { id: "aws", label: "AWS" }, { id: "graphql", label: "GraphQL", isCustom: true }] },
      { level: "BEGINNER", skills: [] },
    ],
  },
  { category: "FOUNDATIONAL", lanes: [{ level: "ADVANCED", skills: [{ id: "communication", label: "Communication" }] }] },
];

const lane = (name: string) => screen.getByRole("region", { name });

describe("SkillBoard", () => {
  it("shows categories, counts, proficiency text and collapsed lanes", async () => {
    const user = userEvent.setup();
    render(<SkillBoard categories={categories} />);
    expect(screen.getByRole("heading", { level: 3, name: "Technical" })).toBeTruthy();
    expect(screen.getByText("6 skills")).toBeTruthy();
    const intermediate = lane("Intermediate Technical skills");
    expect(within(intermediate).getByText("Showing 3 of 4")).toBeTruthy();
    expect(within(intermediate).queryByText("GraphQL")).toBeNull();
    await user.click(within(intermediate).getByRole("button", { name: "Show all 4" }));
    expect(within(intermediate).getByText("Showing 4 of 4")).toBeTruthy();
    expect(within(intermediate).getByText("Custom")).toBeTruthy();
    await user.click(within(intermediate).getByRole("button", { name: "Show fewer" }));
    expect(within(intermediate).getByText("Showing 3 of 4")).toBeTruthy();
    expect(within(lane("Beginner Technical skills")).getByText("No skills at this level")).toBeTruthy();
  });

  it("renders read-only chips in view mode", () => {
    render(<SkillBoard categories={categories} />);
    expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull();
    expect(screen.queryByRole("button", { name: /TypeScript/ })).toBeNull();
  });

  it("opens the Move menu from the chip with a pointer and moves within the category", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<SkillBoard categories={categories} mode="edit" onMove={onMove} />);
    await user.click(screen.getByRole("button", { name: "TypeScript, Advanced" }));
    const menu = screen.getByRole("menu", { name: "Move TypeScript" });
    expect(within(menu).getByRole("menuitemradio", { name: "Advanced" }).getAttribute("aria-checked")).toBe("true");
    await user.click(within(menu).getByRole("menuitemradio", { name: "Move to Beginner" }));
    expect(onMove).toHaveBeenCalledWith("typescript", "BEGINNER", "TECHNICAL");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(screen.getByRole("status").textContent).toBe("TypeScript moved to Beginner. Category remains Technical.");
  });

  it("opens the Move menu with Enter and Space", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<SkillBoard categories={categories} mode="edit" onMove={onMove} />);
    screen.getByRole("button", { name: "React, Intermediate" }).focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu", { name: "Move React" })).toBeTruthy();
    await user.keyboard("{Escape}");
    screen.getByRole("button", { name: "React, Intermediate" }).focus();
    await user.keyboard(" ");
    expect(screen.getByRole("menu", { name: "Move React" })).toBeTruthy();
    await user.click(screen.getByRole("menuitemradio", { name: "Move to Advanced" }));
    expect(onMove).toHaveBeenCalledWith("react", "ADVANCED", "TECHNICAL");
  });

  it("removes a skill from its × button without opening the menu", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<SkillBoard categories={categories} mode="edit" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remove System Design" }));
    expect(onRemove).toHaveBeenCalledWith("system-design");
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("status").textContent).toBe("System Design removed from your profile.");
  });

  it("removes a skill from the Move menu", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<SkillBoard categories={categories} mode="edit" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Communication, Advanced" }));
    await user.click(screen.getByRole("menuitem", { name: "Remove skill" }));
    expect(onRemove).toHaveBeenCalledWith("communication");
  });

  it("explains the category rule in edit mode", () => {
    render(<SkillBoard categories={categories} mode="edit" />);
    expect(screen.getByText(/Category is fixed/)).toBeTruthy();
  });

  it("keeps a moved chip visible in its new lane while the lane is collapsed", async () => {
    const user = userEvent.setup();
    function Stateful() {
      const [data, setData] = useState(categories);
      const move = (id: string, to: Proficiency) =>
        setData((current) =>
          current.map((category) => {
            const moved = category.lanes.flatMap((lane) => lane.skills).find((skill) => skill.id === id);
            if (!moved) return category;
            return { ...category, lanes: category.lanes.map((lane) => ({ ...lane, skills: lane.level === to ? [...lane.skills, moved] : lane.skills.filter((skill) => skill.id !== id) })) };
          })
        );
      return <SkillBoard categories={data} mode="edit" collapsedCount={1} onMove={move} />;
    }
    render(<Stateful />);
    await user.click(screen.getByRole("button", { name: "React, Intermediate" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Move to Advanced" }));
    const advanced = lane("Advanced Technical skills");
    expect(within(advanced).getByRole("button", { name: "React, Advanced" })).toBeTruthy();
    expect(within(advanced).getByText("Showing 2 of 3")).toBeTruthy();
  });
});
