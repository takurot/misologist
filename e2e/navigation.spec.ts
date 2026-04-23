import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads in English by default', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Misologist/);
    await expect(page.getByRole('heading', { level: 1, name: /Turn fermentation/i })).toBeVisible();
    await expect(page.getByText(/Start diagnosis/i)).toBeVisible();
  });

  test('nav links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^Diagnose$/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Knowledge$/ }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Batches$/ }).first()).toBeVisible();
  });

  test('language toggle switches homepage copy to Japanese', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /日本語/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: /発酵を、/ })).toBeVisible();
    await expect(page.getByText(/診断を開始する/)).toBeVisible();
  });

  test('navigates to diagnosis page', async ({ page }) => {
    await page.goto('/diagnosis');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigates to knowledge page', async ({ page }) => {
    await page.goto('/knowledge');
    await expect(page.getByRole('heading', { level: 1, name: /Craft Knowledge Translation/i })).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('navigates to batches page', async ({ page }) => {
    await page.goto('/batches');
    await expect(page.getByRole('heading', { level: 1, name: /Batch Management/i })).toBeVisible();
  });
});
