import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FocusCard, ProfileHero, ProfilePlaceholder, ProfileSection, RecordActionsMenu, RecordItem } from "./Profile";
import { MenuItem } from "../../primitives/Menu/Menu";
import { Button } from "../../primitives/Button/Button";

describe("Profile compositions", () => {
  it("structures a section with a heading, description, action and records", () => {
    render(
      <ProfileSection title="Work experience" description="Roles and employment history" action={<Button size="sm">Add experience</Button>} flush>
        <RecordItem title="Senior Product Engineer" subtitle="Shopify · Full-time" meta="Mar 2024 – Current" />
      </ProfileSection>
    );
    expect(screen.getByRole("heading", { level: 2, name: "Work experience" })).toBeTruthy();
    expect(screen.getByRole("heading", { level: 3, name: "Senior Product Engineer" })).toBeTruthy();
    expect(screen.getByText("Shopify · Full-time")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add experience" })).toBeTruthy();
  });

  it("names the record actions button after the record", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <RecordItem title="Software Engineer" action={<RecordActionsMenu recordLabel="Software Engineer" onAction={onAction}><MenuItem id="edit" icon="pencil">Edit</MenuItem><MenuItem id="remove" tone="danger" icon="close">Remove</MenuItem></RecordActionsMenu>} />
    );
    await user.click(screen.getByRole("button", { name: "Actions for Software Engineer" }));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    expect(onAction.mock.lastCall?.[0]).toBe("edit");
  });

  it("renders the hero, placeholders and focus cards with text for every status", () => {
    render(
      <>
        <ProfileHero name="Taylor Morgan" subtitle="Your profile is ready to build." status="Incomplete" />
        <ProfilePlaceholder icon="briefcase" title="Work experience" description="Add your roles, companies, dates, and employment history." action={<Button>Add experience</Button>} />
        <FocusCard icon="bar-chart" title="Software & Technology" description="Software engineering, platforms, cloud, and technical product work." isPrimary />
      </>
    );
    expect(screen.getByText("Taylor Morgan")).toBeTruthy();
    expect(screen.getByText("Incomplete")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Work experience" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Software & Technology" })).toBeTruthy();
    expect(screen.getByText("Primary")).toBeTruthy();
  });
});
