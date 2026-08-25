const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const corePages = [
  "/",
  "/how-it-works.html",
  "/platform.html",
  "/apollo.html",
  "/landscape.html",
  "/express-interest.html",
  "/investors.html",
  "/privacy.html",
  "/services/expression/",
  "/investor-deck.html"
];

for (const url of corePages) {
  test(`${url} has no serious accessibility or overflow failures`, async ({ page }) => {
    await page.goto(url);
    await expect(page.locator("h1")).toHaveCount(1);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations
      .filter((item) => ["serious", "critical"].includes(item.impact))
      .map((item) => ({
        id: item.id,
        targets: item.nodes.map((node) => node.target.join(" "))
      }));
    expect(serious).toEqual([]);
  });
}

test("mobile navigation is keyboard-operable", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only behavior");
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Toggle menu" });
  await expect(toggle).toBeVisible();
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await toggle.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Run an experiment", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
});

test("customer EOI exposes required safe-intake controls", async ({ page }) => {
  await page.goto("/express-interest.html");
  await expect(page.getByLabel("Full name")).toBeVisible();
  await expect(page.getByLabel("Closest assay class")).toBeVisible();
  await expect(page.getByLabel("Non-confidential project summary")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit EOI →" })).toBeVisible();
  await expect(page.getByText("Do not submit confidential sequences")).toBeVisible();
});

test("Adaptyv expression calculator supports INR, tiers, replicates, and shipping FAQ", async ({ page }) => {
  await page.goto("/services/expression/");
  await expect(page.getByRole("heading", { name: "Expression", level: 1 })).toBeVisible();
  await expect(page.locator('.site-nav a[href="/services/expression/"]')).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("contentinfo").getByRole("link", { name: "Adaptyv Bio expression" })).toBeVisible();
  await expect(page.locator("#grand-total")).toHaveText("$4,740");

  await page.getByRole("button", { name: "INR" }).click();
  await expect(page.locator("#grand-total")).toContainText("₹");

  await page.getByRole("button", { name: "USD" }).click();
  for (const [count, tier, price] of [
    [47, "T1", "$89"],
    [48, "T2", "$79"],
    [91, "T3", "$69"],
    [189, "T4", "$59"],
    [401, "T5", "$49"]
  ]) {
    await page.locator("#protein-count").fill(String(count));
    await expect(page.locator("#tier-name")).toHaveText(tier);
    await expect(page.locator("#unit-price")).toHaveText(price);
  }

  await page.locator("#protein-count").fill("60");
  await page.getByRole("button", { name: "3 Triplicate" }).click();
  await expect(page.locator("#replicate-cost-row")).toBeVisible();
  await expect(page.locator("#replicate-cost")).toHaveText("$540");

  await page.getByLabel(/Release results on Proteinbase/).check();
  await expect(page.locator("#discount-row")).toBeVisible();
  await expect(page.locator("#grand-total")).toHaveText("$4,224");

  await page.getByText("Can protein samples be shipped to me in India?").click();
  await expect(page.getByText(/Sequel LifeCare/).last()).toBeVisible();
});

for (const [url, sourceUrl] of [
  ["/express-interest.html", "https://programmablebio.tech/express-interest.html"],
  ["/investors.html", "https://programmablebio.tech/investors.html"]
]) {
  test(`${url} has the documented FormSubmit wiring`, async ({ page }) => {
    await page.goto(url);
    const form = page.locator('form[action^="https://formsubmit.co/"]');
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute("method", "POST");
    await expect(form).toHaveAttribute("accept-charset", "UTF-8");
    await expect(form.locator('input[name="_next"]')).toHaveValue(
      "https://programmablebio.tech/thanks.html"
    );
    await expect(form.locator('input[name="_url"]')).toHaveValue(sourceUrl);
    await expect(form.locator('input[name="_template"]')).toHaveValue("table");
    await expect(form.locator('input[name="_honey"]')).toBeHidden();
    await expect(form.locator('input[name="email"]')).toHaveCount(1);
    await expect(form.locator('input[name="_captcha"]')).toHaveCount(0);
  });
}

test("legacy URLs redirect to current content", async ({ page }) => {
  await page.goto("/clinical.html");
  await page.waitForURL("**/apollo.html");
  await expect(page.locator("h1")).toContainText("proposed Apollo");
});

test("captures core-page visual artifacts", async ({ page }, testInfo) => {
  for (const [name, url] of [
    ["home", "/"],
    ["customer-eoi", "/express-interest.html"],
    ["investor-deck", "/investor-deck.html"]
  ]) {
    await page.goto(url);
    const image = await page.screenshot({ fullPage: name !== "investor-deck" });
    await testInfo.attach(`${testInfo.project.name}-${name}`, {
      body: image,
      contentType: "image/png"
    });
  }
});
