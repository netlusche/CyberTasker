import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-commands';

test.describe('TS-15: Admin Maintenance & Purge', () => {

    test('TS-15.1: Purge Unverified Ghost Accounts', async ({ page }) => {
        await loginAsAdmin(page);

        // Open Admin Console
        await page.getByTestId('admin-btn').click();
        await expect(page.getByTestId('modal-title')).toContainText(/Admin/i);

        // Search & Verify Ghost users exist
        const searchInput = page.getByTestId('admin-search');
        await searchInput.fill('Ghost_User');
        await page.waitForTimeout(500); // 500ms debounce
        await expect(page.locator('tbody tr')).toHaveCount(5);

        // Click Purge Unverified button
        await page.getByRole('button', { name: /PURGE UNVERIFIED|REINIGUNG NICHT ÜBERPRÜFT/i }).click();

        // Confirm Modal
        // Confirm Modal
        await page.getByTestId('confirm-button').click();

        // Expect Success Alert (should say 5 accounts purged)
        await expect(page.getByTestId('admin-alert-success')).toContainText(/5/);

        // Verify Ghost users are gone from datagrid
        await searchInput.clear();
        await searchInput.fill('Ghost_User');
        await page.waitForTimeout(500);
        await expect(page.locator('tbody')).toContainText(/No recruits found|Keine Rekruten|NO RECRUITS FOUND|NO ACTIVE DIRECTIVES/i);
    });

    test('TS-15.2: Purge Inactive Accounts with different retention periods (1, 5, 10 Years)', async ({ page }) => {
        await loginAsAdmin(page);

        await page.getByTestId('admin-btn').click();
        await expect(page.getByTestId('modal-title')).toContainText(/Admin/i);

        // Find the select element to change retention
        // Using locator and filtering to ensure we hit the dropdown and not something else
        const select = page.locator('select.bg-black.border-cyber-primary');
        const purgeBtn = page.getByRole('button', { name: /PURGE INACTIVE|REINIGUNG INAKTIV/i });

        // --- 1. Test Purge > 10 Years ---
        await select.selectOption('10');
        await purgeBtn.click();
        await page.getByTestId('confirm-button').click();
        // Should purge 2 users (10Y and 11Y)
        await expect(page.getByTestId('admin-alert-success')).toContainText(/2/);

        // Wait for grid fetching/alert dismissing to settle
        await page.waitForTimeout(1000);

        // --- 2. Test Purge > 5 Years ---
        await select.selectOption('5');
        await purgeBtn.click();
        await page.getByTestId('confirm-button').click();
        // Should purge 1 user (5Y)
        await expect(page.getByTestId('admin-alert-success')).toContainText(/1/);

        await page.waitForTimeout(1000);

        // --- 3. Test Purge > 1 Year ---
        await select.selectOption('1');
        await purgeBtn.click();
        await page.getByTestId('confirm-button').click();
        // Should purge 2 users (1Y and 2Y)
        await expect(page.getByTestId('admin-alert-success')).toContainText(/2/);
    });

});
