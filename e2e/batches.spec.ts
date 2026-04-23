import { test, expect } from '@playwright/test';

test.describe('Batches Page', () => {
  test('renders page heading', async ({ page }) => {
    await page.goto('/batches');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('has new batch button', async ({ page }) => {
    await page.goto('/batches');
    const newBtn = page.getByRole('link', { name: /New batch/ });
    await expect(newBtn).toBeVisible();
  });

  test('navigates to new batch form', async ({ page }) => {
    await page.goto('/batches');
    await page.getByRole('link', { name: /New batch/ }).click();
    await expect(page).toHaveURL(/\/batches\/new/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('renders either data or a configuration error', async ({ page }) => {
    await page.goto('/batches');
    await expect(
      page.getByText(/Supabase is not configured/i).or(page.getByRole('heading', { name: /Batch Management/i }))
    ).toBeVisible({ timeout: 15000 });
  });
});

test.describe('New Batch Form', () => {
  test('renders required fields', async ({ page }) => {
    await page.goto('/batches/new');
    await expect(page.getByLabel(/Batch name/)).toBeVisible();
    await expect(page.getByLabel(/Batch start date/)).toBeVisible();
  });

  test('submit button is present', async ({ page }) => {
    await page.goto('/batches/new');
    await expect(page.getByRole('button', { name: /Create batch/ })).toBeVisible();
  });

  test('date field has today as default', async ({ page }) => {
    await page.goto('/batches/new');
    const dateInput = page.getByLabel(/Batch start date/);
    const value = await dateInput.inputValue();
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Should be today's date (not a past date from UTC offset bug)
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    expect(value).toBe(localDate);
  });

  test('cancel returns to batches list', async ({ page }) => {
    await page.goto('/batches/new');
    await page.getByRole('link', { name: /Cancel/ }).click();
    await expect(page).toHaveURL(/\/batches$/);
  });

  test('submit either surfaces a configuration error or creates the batch', async ({ page }) => {
    await page.goto('/batches/new');
    await page.getByLabel(/Batch name/).fill('E2E Batch');
    await page.getByLabel(/Batch start date/).fill('2026-04-20');
    await page.getByRole('button', { name: /Create batch/ }).click();

    await expect(
      page.getByText(/Supabase is not configured/i).or(page.getByRole('heading', { name: /E2E Batch/i }))
    ).toBeVisible({ timeout: 15000 });
  });
});
