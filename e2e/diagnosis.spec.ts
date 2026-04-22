import { test, expect } from '@playwright/test';

test.describe('Diagnosis Page', () => {
  test('renders page heading and upload area', async ({ page }) => {
    await page.goto('/diagnosis');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // File input should be present (accessible)
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeAttached();
  });

  test('file input has aria-label', async ({ page }) => {
    await page.goto('/diagnosis');
    const fileInput = page.locator('input[type="file"]');
    const ariaLabel = await fileInput.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
  });

  test('analyze button is disabled before photo upload', async ({ page }) => {
    await page.goto('/diagnosis');
    const analyzeBtn = page.getByRole('button', { name: /Diagnose batch/ });
    // Button should be absent or disabled without an image
    const count = await analyzeBtn.count();
    if (count > 0) {
      await expect(analyzeBtn).toBeDisabled();
    }
  });

  test('metadata form fields render', async ({ page }) => {
    await page.goto('/diagnosis');
    await expect(page.getByLabel(/Batch start date/)).toBeVisible();
    await expect(page.getByLabel(/Storage temperature/)).toBeVisible();
  });
});
