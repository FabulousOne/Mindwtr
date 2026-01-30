import { test, expect } from '@playwright/test';

test('loads the inbox view', async ({ page }) => {
    await page.goto('/');
    const inboxNav = page.locator('[data-sidebar-item][data-view="inbox"]');
    await expect(inboxNav).toBeVisible();
});
