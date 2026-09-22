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
