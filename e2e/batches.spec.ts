import { test, expect } from '@playwright/test';

test.describe('Batches Page', () => {
  test('renders page heading', async ({ page }) => {
    await page.goto('/batches');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('has new batch button', async ({ page }) => {
    await page.goto('/batches');
    const newBtn = page.getByRole('link', { name: /新規バッチ/ });
    await expect(newBtn).toBeVisible();
  });

  test('navigates to new batch form', async ({ page }) => {
    await page.goto('/batches');
    await page.getByRole('link', { name: /新規バッチ/ }).click();
    await expect(page).toHaveURL(/\/batches\/new/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});

test.describe('New Batch Form', () => {
  test('renders required fields', async ({ page }) => {
    await page.goto('/batches/new');
    await expect(page.getByLabel(/バッチ名/)).toBeVisible();
    await expect(page.getByLabel(/仕込み開始日/)).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    await page.goto('/batches/new');
    await expect(page.getByRole('button', { name: /バッチを仕込む/ })).toBeVisible();
  });

  test('date field has today as default', async ({ page }) => {
    await page.goto('/batches/new');
    const dateInput = page.getByLabel(/仕込み開始日/);
    const value = await dateInput.inputValue();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Should be today's date (not a past date from UTC offset bug)
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(value).toBe(localDate);
  });

  test('cancel returns to batches list', async ({ page }) => {
    await page.goto('/batches/new');
    await page.getByRole('link', { name: /キャンセル/ }).click();
    await expect(page).toHaveURL(/\/batches$/);
  });
});
