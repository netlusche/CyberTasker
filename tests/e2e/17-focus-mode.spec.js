import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';

test.describe('Focus Mode (Zen)', () => {
    test.beforeEach(async ({ page }) => {
        // Create a completely clean user for this test to avoid seeded data interference
        await page.goto('/');

        const timestamp = Date.now();
        const username = `zen_user_${timestamp}`;
        const email = `zen_${timestamp}@cyber.local`;
        const password = 'ZenPassword123!';

        // Wait for page to be interactable then Register
        await page.waitForTimeout(2000); // Give the react app time to boot
        const authToggle = page.getByTestId('auth-toggle');

        try {
            await expect(authToggle).toBeVisible({ timeout: 5000 });
        } catch (e) {
            await page.screenshot({ path: '/tmp/auth-failed.png' });
            throw e;
        }
        await authToggle.click();

        await page.locator('input[placeholder*="CODENAME"], input[placeholder*="BENUTZERNAME"]').fill(username);
        await page.locator('input[placeholder*="COM-LINK"], input[placeholder*="EMAIL"]').fill(email);
        await page.locator('input[placeholder*="ACCESS KEY"], input[placeholder*="PASSWORT"]').fill(password);
        await page.locator('form button[type="submit"]').click();

        // Acknowledge alert if it appears
        try {
            const alertBox = page.getByTestId('cyber-alert');
            await expect(alertBox).toBeVisible({ timeout: 3000 });
            await alertBox.getByTestId('alert-acknowledge').click();
        } catch (e) {
            // Alert didn't show, meaning we can proceed to login natively
        }

        // Login
        await page.locator('input[placeholder*="CODENAME"], input[placeholder*="BENUTZERNAME"]').fill(username);
        await page.locator('input[placeholder*="ACCESS KEY"], input[placeholder*="PASSWORT"]').fill(password);
        await page.locator('form button[type="submit"]').click();

        await expect(page.getByTestId('profile-btn')).toBeVisible({ timeout: 15000 });
    });

    test('should activate Focus Mode and cycle through tasks', async ({ page }) => {
        // Ensure we purge any default seeded tasks for this new user so our exact order test passes securely
        try {
            execSync(`sqlite3 api/cybertracker.db "DELETE FROM tasks WHERE user_id = (SELECT id FROM users ORDER BY id DESC LIMIT 1);"`, { cwd: process.cwd() });
        } catch (err) {
            console.error("Failed to purge tasks in setup", err);
        }
        await page.reload();

        // Re-verify regular dashboard is back and empty
        await expect(page.getByPlaceholder('Enter directive...')).toBeVisible();

        const timestamp = Date.now();
        const baseTitle = `Focus Task ${timestamp}`;

        const titles = [
            `${baseTitle} One`,
            `${baseTitle} Two`,
            `${baseTitle} Three`
        ];

        // Ensure we create them in order with varying priority
        for (let i = 0; i < titles.length; i++) {
            await page.getByPlaceholder('Enter directive...').fill(titles[i]);

            if (i === 0) {
                // Task 0 -> Priority 1
                await page.locator('div[role="button"]').filter({ hasText: '(2)' }).click({ force: true });
                await page.getByRole('listbox').locator('li').filter({ hasText: '(1)' }).click();
                await page.waitForTimeout(100);
            } else if (i === 1) {
                // Task 1 -> Priority 2
                await page.locator('div[role="button"]').filter({ hasText: '(1)' }).click({ force: true });
                await page.getByRole('listbox').locator('li').filter({ hasText: '(2)' }).click();
                await page.waitForTimeout(100);
            } else if (i === 2) {
                // Task 2 -> Priority 3
                await page.locator('div[role="button"]').filter({ hasText: '(2)' }).click({ force: true });
                await page.getByRole('listbox').locator('li').filter({ hasText: '(3)' }).click();
                await page.waitForTimeout(100);
            }

            const dirInput = page.getByPlaceholder('Enter directive...');
            await page.getByRole('button', { name: /Add/i }).click();
            await expect(dirInput).toHaveValue('');
            await page.waitForTimeout(500); // allow creation
        }

        // Activate Focus Mode
        const focusBtn = page.getByTestId('focus-btn');
        await expect(focusBtn).toBeVisible();
        await focusBtn.click();

        // Verify we are in Focus Mode
        await expect(page.locator('text=FOCUS MODE ENGAGED')).toBeHidden();
        await expect(page.locator('text=[ FOCUS MODE ACTIVE ]')).toBeVisible();

        const heroCard = page.locator('.card-cyber').first();

        // EXPECTED STRICT ORDER (due to sort logic in FocusHeroCard):
        // Priority 1: titles[0]
        // Priority 2: titles[1]
        // Priority 3: titles[2]

        const expectedOrder = [
            titles[0],
            titles[1],
            titles[2]
        ];

        // 1. Assert Task 0
        await expect(heroCard).toContainText(expectedOrder[0]);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 2. Assert Task 1
        await expect(heroCard).toContainText(expectedOrder[1]);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 3. Assert Task 2
        await expect(heroCard).toContainText(expectedOrder[2]);

        // Complete the task to ensure it functions
        await page.getByRole('button', { name: /mark (as )?done|complete/i }).click();
        await page.waitForTimeout(1000);

        // 4. Skip from the absolute end of the queue - should loop back to the start!
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // Assert it looped perfectly back to expectedOrder[0]
        await expect(heroCard).toContainText(expectedOrder[0]);

        // 5. Skip once more to prove the index continues incrementing normally after looping
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        await expect(heroCard).toContainText(expectedOrder[1]);

        // Exit Focus Mode
        await focusBtn.click();

        // Verify regular dashboard is back
        await expect(page.getByPlaceholder('Enter directive...')).toBeVisible();
    });
});
