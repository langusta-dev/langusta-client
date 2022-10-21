import { test, expect } from '@playwright/test';

test.describe('login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login with local profile', async ({ page }) => {
    await page
      .locator('button', {
        hasText: 'Continue without logging in',
      })
      .click();

    await page.locator('button', { hasText: 'Confirm' }).click();

    await expect(page).not.toHaveURL(/\/login$/);
  });
});
