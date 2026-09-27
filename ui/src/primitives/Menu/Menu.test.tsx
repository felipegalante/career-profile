import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Menu, MenuItem, MenuSection, MenuSeparator, MenuTrigger } from "./Menu";
import { Button } from "../Button/Button";
import { Icon } from "../../foundations/Icon";

describe("Menu", () => {
  it("opens from its trigger, supports arrow keys and reports the chosen action", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <MenuTrigger>
        <Button variant="ghost" isIconOnly aria-label="Record actions"><Icon name="more-horizontal" /></Button>
        <Menu onAction={onAction}>
          <MenuItem id="edit" icon="pencil">Edit</MenuItem>
          <MenuItem id="remove" icon="close" tone="danger">Remove</MenuItem>
        </Menu>
      </MenuTrigger>
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("menu")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("menuitem", { name: "Edit" }));
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onAction.mock.lastCall?.[0]).toBe("remove");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("checks the selected item in a single-selection section", async () => {
    const user = userEvent.setup();
    render(
      <MenuTrigger>
        <Button>GraphQL</Button>
        <Menu aria-label="Move GraphQL">
          <MenuSection selectionMode="single" selectedKeys={["INTERMEDIATE"]}>
            <MenuItem id="BEGINNER">Move to Beginner</MenuItem>
            <MenuItem id="INTERMEDIATE">Intermediate</MenuItem>
            <MenuItem id="ADVANCED">Move to Advanced</MenuItem>
          </MenuSection>
          <MenuSeparator />
          <MenuItem id="remove" tone="danger">Remove skill</MenuItem>
        </Menu>
      </MenuTrigger>
    );
    await user.click(screen.getByRole("button", { name: "GraphQL" }));
    expect(screen.getByRole("menuitemradio", { name: "Intermediate" }).getAttribute("aria-checked")).toBe("true");
    expect(screen.getByRole("menuitemradio", { name: "Move to Advanced" }).getAttribute("aria-checked")).toBe("false");
  });
});
