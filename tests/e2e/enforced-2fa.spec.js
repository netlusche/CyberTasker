import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-commands.js';

import { execSync } from 'child_process';

test.describe('US-2.5.10: Enforced Email 2FA Policy', () => {

    test.afterAll(async () => {
        console.log('Resetting Database after enforced-2fa test...');
        execSync('php tests/seed_test_data.php');
    });

    test('Admin can enable Enforce Email 2FA and intercept non-TOTP logins', async ({ page }) => {
        // 1. Login as Admin
        await loginAsAdmin(page);

        // 2. Open Admin Panel
        await page.getByRole('button', { name: 'ADMIN' }).click();
        await expect(page.getByText(/ADMIN/i).first()).toBeVisible();

        // 3. Toggle "Enforce Email 2FA"
        const toggle = page.locator('[data-testid="enforce-email-2fa-toggle"]');
        const isChecked = await toggle.evaluate(node => node.checked);
        if (!isChecked) {
            await page.locator('label', { has: toggle }).click();
            await expect(page.getByText(/Updated/i)).toBeVisible();
        }

        // 4. Logout Admin (Close Admin Modal first)
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500); // give it time to animate out
        await page.getByRole('button', { name: 'LOGOUT' }).click({ force: true });
        await expect(page.locator('form input:visible').first()).toBeVisible({ timeout: 10000 });

        const usernameInput = page.getByPlaceholder(/codename/i).first();
        await expect(usernameInput).toBeVisible({ timeout: 10000 });

        const toggleBtn = page.getByTestId('auth-toggle');
        if (await toggleBtn.textContent() === 'HAS IDENTITY? // LOGIN') {
            await toggleBtn.click();
        }

        await usernameInput.fill('Test_User_001');
        await page.getByPlaceholder(/access key/i).first().fill('Baseline_Pass_1!');
        await page.locator('form button[type="submit"]').click();

        // 6. Assert intercept screen appears
        await expect(page.getByText(/EMERGENCY OVERRIDE/i)).toBeVisible({ timeout: 15000 });
    });
});
