import { expect, test } from "@playwright/test";

test("register form keeps password controls accessible on desktop and mobile", async ({ page }) => {
  await page.route("**/graphql", async (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { viewer: null } }) }));
  await page.goto("/register");
  await expect(page.getByRole("heading", { name: "Start your Career Profile" })).toBeVisible();
  const password = page.getByLabel("Password", { exact: true });
  await password.fill("ValidPassword!1");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByText("Build a profile that stays useful")).toBeHidden();
});

test("set password accepts the setup proof and removes it from the URL without clearing router state", async ({ page }) => {
  await page.route("**/graphql", async (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { viewer: null } }) }));
  await page.goto("/set-password#proof=example");
  await expect(page.getByRole("heading", { level: 1, name: "Set your password" })).toBeVisible();
  await expect(page.getByLabel("Verify password", { exact: true })).toBeVisible();
  await expect(page).toHaveURL((url) => url.pathname === "/set-password" && url.hash === "");
  expect(await page.evaluate(() => (window.history.state as { idx?: unknown } | null)?.idx)).toBe(0);
});

const passwordScreens = [
  { path: "/login", url: "/login", heading: "Sign in to Career Profile", labels: ["Password"] },
  { path: "/register", url: "/register", heading: "Start your Career Profile", labels: ["Password", "Verify password"] },
  { path: "/set-password", url: "/set-password#proof=example", heading: "Set your password", labels: ["Password", "Verify password"] },
];

for (const screen of passwordScreens) {
  test(`every password input on ${screen.path} can be shown and hidden by pointer or keyboard without losing its value`, { tag: ["@AUTH-AC-002"] }, async ({ page }) => {
    await page.route("**/graphql", async (route) => route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { viewer: null } }) }));
    await page.goto(screen.url);
    await expect(page.getByRole("heading", { level: 1, name: screen.heading })).toBeVisible();

    for (const label of screen.labels) {
      const input = page.getByLabel(label, { exact: true });
      const subject = label.toLowerCase();
      await input.fill("Visible!Secret1");

      await page.getByRole("button", { name: `Show ${subject}` }).click();
      await expect(input).toHaveAttribute("type", "text");
      await expect(input).toBeFocused();

      await page.getByRole("button", { name: `Hide ${subject}` }).press("Enter");
      await expect(input).toHaveAttribute("type", "password");
      await expect(input).toHaveValue("Visible!Secret1");
    }
  });
}
