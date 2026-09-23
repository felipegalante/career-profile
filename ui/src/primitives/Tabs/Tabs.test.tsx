import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";
import { Tooltip } from "../Tooltip/Tooltip";
import { Button } from "../Button/Button";
import { UiProvider } from "../../foundations/UiProvider";
import { TextLink } from "../Link/Link";

describe("Tabs", () => {
  it("moves focus with arrow keys and selects only on Enter", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <Tabs defaultSelectedKey="profile" onSelectionChange={onSelectionChange}>
        <TabList aria-label="Account">
          <Tab id="profile">Profile</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>
        <TabPanel id="profile">Profile information</TabPanel>
        <TabPanel id="settings">Security</TabPanel>
      </Tabs>
    );
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Settings" }));
    expect(screen.getByRole("tab", { name: "Profile" }).getAttribute("aria-selected")).toBe("true");
    await user.keyboard("{Enter}");
    expect(onSelectionChange).toHaveBeenLastCalledWith("settings");
    expect(screen.getByRole("tabpanel").textContent).toBe("Security");
  });
});

describe("Tooltip", () => {
  it("describes its trigger on keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Tooltip content="Professional Focus"><Button aria-label="Professional Focus">PF</Button></Tooltip>);
    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip.textContent).toBe("Professional Focus");
    expect(screen.getByRole("button").getAttribute("aria-describedby")).toBe(tooltip.id);
  });
});

describe("UiProvider", () => {
  it("routes library links through the application router", async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();
    render(<UiProvider navigate={navigate}><TextLink href="/register">Create an account</TextLink></UiProvider>);
    await user.click(screen.getByRole("link", { name: "Create an account" }));
    expect(navigate).toHaveBeenCalledWith("/register", undefined);
  });
});
