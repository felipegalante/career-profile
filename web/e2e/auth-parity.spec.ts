import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { artifactUrl, blockRemoteFonts, WCAG_TAGS } from "./support/artifacts";

type Setup = (page: Page) => Promise<void>;

interface AuthPair {
  id: string;
  artifact: string;
  artifactSelector: string;
  route: string;
  appSelector: string;
  properties: string[];
  setup?: Setup;
  /** Properties that intentionally differ from the artifact, with the reason. */
  deviations?: Record<string, string>;
}

const INK_3 = "--ink-3 is darkened from L 0.54 to 0.51 so faint text meets WCAG AA contrast.";

async function mockApi(page: Page, loginError = false) {
  await page.route("**/graphql", async (route) => {
    const body = route.request().postDataJSON() as { query?: string } | null;
    if (loginError && body?.query?.includes("mutation Login")) {
      await route.fulfill({ contentType: "application/json", body: JSON.stringify({ errors: [{ message: "Email or password is incorrect.", extensions: { code: "INVALID_CREDENTIALS" } }] }) });
      return;
    }
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ data: { viewer: null } }) });
  });
}

const failLogin: Setup = async (page) => {
  await page.getByRole("textbox", { name: "Email" }).fill("maya@example.com");
  await page.getByLabel("Password", { exact: true }).fill("WrongPassword!1");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("alert").waitFor();
};

const mismatch: Setup = async (page) => {
  await page.getByLabel("Password", { exact: true }).fill("ValidPassword!1");
  await page.getByLabel("Verify password", { exact: true }).fill("Different!1");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.getByText("Passwords do not match.").waitFor();
};

const TYPE = ["font-size", "line-height", "font-weight", "letter-spacing", "margin-top", "margin-bottom", "color"];

const pairs: AuthPair[] = [
  { id: "login-panel", artifact: "auth/login.html", artifactSelector: ".auth-panel", route: "/login", appSelector: "main > section:first-child", properties: ["padding-top", "padding-left", "background-color", "display"] },
  { id: "login-title", artifact: "auth/login.html", artifactSelector: ".auth-card h1", route: "/login", appSelector: "main h1", properties: TYPE },
  { id: "login-lead", artifact: "auth/login.html", artifactSelector: ".auth-card > p.lead", route: "/login", appSelector: "main h1 + p", properties: ["color", "margin-top", "margin-bottom"] },
  { id: "login-email", artifact: "auth/login.html", artifactSelector: ".field:first-child .input", route: "/login", appSelector: 'main input[type="email"]', properties: ["height", "padding-left", "border-radius", "background-color", "box-shadow"] },
  { id: "login-submit", artifact: "auth/login.html", artifactSelector: ".btn.primary.lg", route: "/login", appSelector: 'main button[type="submit"]', properties: ["height", "padding-left", "border-radius", "background-color", "color", "font-size", "font-weight"] },
  { id: "login-switch", artifact: "auth/login.html", artifactSelector: ".auth-card > .meta.muted", route: "/login", appSelector: 'main div:has(> a[href="/register"])', properties: ["font-size", "line-height", "color", "margin-top"] },
  { id: "login-switch-link", artifact: "auth/login.html", artifactSelector: ".auth-card > .meta.muted b", route: "/login", appSelector: 'main a[href="/register"]', properties: ["color", "font-weight"] },
  { id: "login-footer", artifact: "auth/login.html", artifactSelector: ".auth-panel > .meta.faint", route: "/login", appSelector: "main > section:first-child > div:last-child", properties: ["font-size", "color"], deviations: { color: INK_3 } },
  { id: "login-error", artifact: "auth/login-error.html", artifactSelector: ".callout.danger", route: "/login", appSelector: '[role="alert"]', properties: ["padding-top", "padding-left", "border-radius", "background-color", "color", "margin-bottom", "gap"], setup: failLogin },
  { id: "register-title", artifact: "auth/register.html", artifactSelector: ".auth-card h1", route: "/register", appSelector: "main h1", properties: TYPE },
  { id: "register-help", artifact: "auth/register.html", artifactSelector: ".field .help", route: "/register", appSelector: 'main [slot="description"]', properties: ["font-size", "color"], deviations: { color: INK_3 } },
  { id: "register-invalid-input", artifact: "auth/register-errors.html", artifactSelector: ".field:nth-child(3) .input.error", route: "/register", appSelector: 'main input[aria-invalid="true"]', properties: ["background-color", "box-shadow"], setup: mismatch },
  { id: "register-error-text", artifact: "auth/register-errors.html", artifactSelector: ".field:nth-child(3) .help.danger-text", route: "/register", appSelector: "main [slot=errorMessage]", properties: ["font-size", "color"], setup: mismatch, deviations: { color: "In the artifact, `.field .help` outranks `.danger-text`, so field errors render grey; errors use the danger color the class names intend." } },
  { id: "setup-unavailable-title", artifact: "auth/set-password-link-invalid.html", artifactSelector: ".auth-card h1", route: "/set-password", appSelector: "main h1", properties: TYPE },
  { id: "setup-unavailable-lead", artifact: "auth/set-password-link-invalid.html", artifactSelector: ".auth-card > p.lead", route: "/set-password", appSelector: "main h1 + p", properties: ["color", "margin-top", "margin-bottom"] },
];

async function styles(page: Page, selector: string, properties: string[], label: string) {
  const element = page.locator(selector).first();
  await expect(element, `${label}: ${selector}`).toBeAttached();
  return element.evaluate((node, names) => Object.fromEntries(names.map((name) => [name, getComputedStyle(node).getPropertyValue(name)])), properties);
}

for (const pair of pairs) {
  test(`${pair.id} matches ${pair.artifact}`, async ({ page, context }) => {
    await blockRemoteFonts(page);
    await page.goto(artifactUrl(pair.artifact));
    const expected = await styles(page, pair.artifactSelector, pair.properties, pair.id);

    const app = await context.newPage();
    await mockApi(app, pair.id === "login-error");
    await app.goto(pair.route);
    await app.locator("main h1").waitFor();
    await pair.setup?.(app);
    const actual = await styles(app, pair.appSelector, pair.properties, pair.id);

    for (const property of pair.properties) {
      const reason = pair.deviations?.[property];
      if (reason) expect(actual[property], `${pair.id} ${property} should still differ: ${reason}`).not.toBe(expected[property]);
      else expect(actual[property], `${pair.id} ${property}`).toBe(expected[property]);
    }
  });
}

for (const [route, setup] of [["/login", undefined], ["/login", failLogin], ["/register", undefined], ["/register", mismatch], ["/set-password", undefined], ["/set-password#proof=example", undefined]] as Array<[string, Setup | undefined]>) {
  test(`${route}${setup ? " with errors" : ""} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await mockApi(page, true);
    await page.goto(route);
    await page.locator("main h1").waitFor();
    await setup?.(page);
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target.join(" ")) }))).toEqual([]);
  });
}
