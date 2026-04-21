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
    const analyzeBtn = page.getByRole('button', { name: /発酵状態を解析/ });
    // Button should be absent or disabled without an image
    const count = await analyzeBtn.count();
    if (count > 0) {
      await expect(analyzeBtn).toBeDisabled();
    }
  });

  test('metadata form fields render', async ({ page }) => {
    await page.goto('/diagnosis');
    // Metadata fields should be visible
    await expect(page.getByLabel(/仕込み開始日/)).toBeVisible();
    await expect(page.getByLabel(/保存温度/)).toBeVisible();
  });
});
