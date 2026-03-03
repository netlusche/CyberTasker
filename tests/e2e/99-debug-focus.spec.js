import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-commands.js';

test('debug focus mode', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

    await loginAsAdmin(page);
    await page.waitForTimeout(2000);

    console.log("Looking for focus button");
    await page.click('[data-testid="focus-btn"]');
    console.log("Clicked focus button. Waiting 2 seconds for crash/errors...");
    await page.waitForTimeout(2000);
});
