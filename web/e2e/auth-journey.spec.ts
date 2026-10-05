import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";
import { createSetupFixture } from "./support/api";

const PASSWORD = "JourneyPassword!1";
const SESSION_COOKIE = "career_profile_session";

async function choosePassword(page: Page, password = PASSWORD) {
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Verify password", { exact: true }).fill(password);
}

async function expectDestination(page: Page, path: "/onboarding" | "/profile") {
  await expect(page).toHaveURL((url) => url.pathname === path);
  await expect(page.getByRole("heading", { level: 1, name: path === "/profile" ? "Profile" : "Onboarding" })).toBeVisible();
}

test.describe("authentication against the API", () => {
  test("a registered session survives a reload, ends on sign-out and cannot be replayed", { tag: ["@AUTH-AC-001", "@AUTH-AC-004", "@AUTH-AC-007", "@AUTH-AC-008"] }, async ({ context, page }) => {
    const email = `journey-${randomUUID()}@careerprofile.test`;
    await page.goto("/register");
    await page.getByLabel("Email").fill(email);
    await choosePassword(page);
    await page.getByRole("button", { name: "Create account" }).click();
    await expectDestination(page, "/onboarding");

    await page.reload();
    await expectDestination(page, "/onboarding");
    const session = (await context.cookies()).find((cookie) => cookie.name === SESSION_COOKIE);
    expect(session).toMatchObject({ httpOnly: true, sameSite: "Lax" });

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/login");
    expect((await context.cookies()).some((cookie) => cookie.name === SESSION_COOKIE)).toBe(false);

    await context.addCookies([session!]);
    await page.goto("/onboarding");
    await expect(page).toHaveURL((url) => url.pathname === "/login");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expectDestination(page, "/onboarding");
  });

  test("a first-password link signs a new account in to onboarding and cannot be used twice", { tag: ["@AUTH-AC-005", "@AUTH-AC-008"] }, async ({ page }) => {
    const fixture = createSetupFixture("first-password");
    await page.goto(`/set-password#proof=${fixture.proof}`);
    await choosePassword(page);
    await page.getByRole("button", { name: "Set password & continue" }).click();
    await expectDestination(page, "/onboarding");

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL((url) => url.pathname === "/login");
    await page.goto(`/set-password#proof=${fixture.proof}`);
    await choosePassword(page);
    await page.getByRole("button", { name: "Set password & continue" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "This setup link is unavailable" })).toBeVisible();
    await expect(page.getByRole("main").getByRole("alert")).toContainText("invalid, expired, or already used");
  });

  test("a reset link returns an account that finished onboarding to the profile", { tag: ["@AUTH-AC-006", "@AUTH-AC-008"] }, async ({ page }) => {
    const fixture = createSetupFixture("reset");
    await page.goto(`/set-password#proof=${fixture.proof}`);
    await choosePassword(page);
    await page.getByRole("button", { name: "Set password & continue" }).click();
    await expectDestination(page, "/profile");
  });
});
