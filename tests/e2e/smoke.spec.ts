import { expect, test } from "@playwright/test";

test.describe("scout smoke tests", () => {
  test("loads jobs board", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Jobs" })).toBeVisible();
    await expect(page.getByText("Scan health")).toBeVisible();
  });

  test("navigates between main pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Pipeline" }).click();
    await expect(page.getByRole("heading", { name: "Pipeline" })).toBeVisible();

    await page.getByRole("link", { name: "Stats" }).click();
    await expect(page.getByRole("heading", { name: "Stats" })).toBeVisible();

    await page.getByRole("link", { name: "Companies" }).click();
    await expect(page.getByRole("heading", { name: "Companies" })).toBeVisible();
  });
});
