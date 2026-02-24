import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-commands.js';

test.describe('US-2.5.10: Enforced Email 2FA Policy', () => {

    test('Admin can enable Enforce Email 2FA and intercept non-TOTP logins', async ({ page }) => {
        // 1. Login as Admin
        await loginAsAdmin(page);

        // 2. Open Admin Panel
        await page.click('[data-testid="header-admin"]');
        await expect(page.getByText(/ADMIN/i).first()).toBeVisible();

        // 3. Toggle "Enforce Email 2FA"
        const toggle = page.locator('[data-testid="enforce-email-2fa-toggle"]');
        const isChecked = await toggle.evaluate(node => node.checked);
        if (!isChecked) {
            await page.locator('label', { has: toggle }).click();
            await expect(page.getByText(/Updated/i)).toBeVisible();
        }

        // 4. Logout Admin
        const closeBtn = page.getByTitle('Close');
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        }
        await page.click('[data-testid="header-logout"]');
        await expect(page.getByText(/NETRUNNER/i)).toBeVisible();

        // 5. Login as regular user
        const inputs = page.locator('form input:visible');
        await expect(inputs).toHaveCount(2, { timeout: 10000 });

        await inputs.nth(0).fill('Agent_Zeta');
        await inputs.nth(1).fill('Zeta_Pass!!99');
        await page.locator('form button[type="submit"]').click();

        // 6. Assert intercept screen appears
        await expect(page.getByText(/EMERGENCY OVERRIDE/i)).toBeVisible({ timeout: 15000 });
    });
});
