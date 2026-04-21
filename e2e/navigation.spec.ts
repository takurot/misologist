import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads with hero section', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Misologist/);
    // Hero heading contains Japanese text
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('nav links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /診断|Diagnosis/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /知識|Knowledge/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /バッチ|Batch/i }).first()).toBeVisible();
  });

  test('navigates to diagnosis page', async ({ page }) => {
    await page.goto('/diagnosis');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigates to knowledge page', async ({ page }) => {
    await page.goto('/knowledge');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();
  });

  test('navigates to batches page', async ({ page }) => {
    await page.goto('/batches');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
