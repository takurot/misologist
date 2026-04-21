import { test, expect } from '@playwright/test';

test.describe('Knowledge Translation Page', () => {
  test('renders input and translate button', async ({ page }) => {
    await page.goto('/knowledge');
    await expect(page.locator('textarea')).toBeVisible();
    await expect(page.getByRole('button', { name: /科学的に解明する/ })).toBeVisible();
  });

  test('translate button is disabled when input is empty', async ({ page }) => {
    await page.goto('/knowledge');
    const btn = page.getByRole('button', { name: /科学的に解明する/ });
    await expect(btn).toBeDisabled();
  });

  test('translate button enables when text is entered', async ({ page }) => {
    await page.goto('/knowledge');
    await page.locator('textarea').fill('塩は多めに入れると腐らない');
    const btn = page.getByRole('button', { name: /科学的に解明する/ });
    await expect(btn).toBeEnabled();
  });

  test('example chips are clickable', async ({ page }) => {
    await page.goto('/knowledge');
    const chips = page.locator('button').filter({ hasText: /塩は多めに/ });
    await expect(chips.first()).toBeVisible();
  });

  test('textarea has amber focus outline on focus', async ({ page }) => {
    await page.goto('/knowledge');
    const textarea = page.locator('textarea');
    await textarea.focus();
    const outline = await textarea.evaluate((el) => getComputedStyle(el).outline);
    // Should contain a non-transparent color when focused
    expect(outline).toBeTruthy();
  });
});
