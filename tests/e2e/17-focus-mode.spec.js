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

        // Register
        await page.getByTestId('auth-toggle').click();
        await page.locator('input[placeholder*="CODENAME"], input[placeholder*="BENUTZERNAME"]').fill(username);
        await page.locator('input[placeholder*="COM-LINK"], input[placeholder*="EMAIL"]').fill(email);
        await page.locator('input[placeholder*="ACCESS KEY"], input[placeholder*="PASSWORT"]').fill(password);
        await page.locator('form button[type="submit"]').click();

        // Acknowledge alert
        const alertBox = page.getByTestId('cyber-alert');
        await expect(alertBox).toBeVisible({ timeout: 15000 });
        await alertBox.getByTestId('alert-acknowledge').click();

        // Login
        await page.locator('input[placeholder*="CODENAME"], input[placeholder*="BENUTZERNAME"]').fill(username);
        await page.locator('input[placeholder*="ACCESS KEY"], input[placeholder*="PASSWORT"]').fill(password);
        await page.locator('form button[type="submit"]').click();

        await expect(page.getByTestId('profile-btn')).toBeVisible({ timeout: 15000 });
    });

    test('should activate Focus Mode and cycle through tasks', async ({ page }) => {
        // Now we have a completely blank slate user with 0 tasks
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

            await page.getByPlaceholder('Enter directive...').press('Enter');
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

        // EXPECTED STRICT ORDER:
        // Priority 1: titles[0] (Newer), "Install Sleep.exe Patch" (Older)
        // Priority 2: titles[1] (Newer), "Hack Coffee Machine..." & "Debug Neural Link..." (Older)
        // Priority 3: titles[2] (Newer), "Feed the Techno-Cat" (Older)

        const expectedOrder = [
            titles[0],
            "Install Sleep.exe Patch",
            titles[1],
            // 3 and 4 could be either of the two seeded work tasks depending on precise db insertion ID since created_at is identical
        ];

        // 1. Assert Task 0
        await expect(heroCard).toContainText(expectedOrder[0]);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 2. Assert Seeded Priority 1 Task
        await expect(heroCard).toContainText(expectedOrder[1]);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 3. Assert Task 1 (Priority 2, Newest)
        await expect(heroCard).toContainText(expectedOrder[2]);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 4 & 5. Skip over the two seeded Priority 2 tasks
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // 6. Assert Task 2 (Priority 3, Newest)
        await expect(heroCard).toContainText(titles[2]);

        // Complete the task to ensure it functions
        await page.getByRole('button', { name: /mark (as )?done|complete/i }).click();
        await page.waitForTimeout(1000);

        // 7. Assert Seeded Priority 3 Task remaining
        await expect(heroCard).toContainText("Feed the Techno-Cat");

        // 8. Skip from the absolute end of the queue - should loop back to the start!
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        // Assert it looped perfectly back to expectedOrder[0]
        await expect(heroCard).toContainText(expectedOrder[0]);

        // 9. Skip once more to prove the index continues incrementing normally after looping
        await page.getByRole('button', { name: 'SKIP / NEXT' }).click();
        await page.waitForTimeout(500);

        await expect(heroCard).toContainText(expectedOrder[1]);

        // Exit Focus Mode
        await focusBtn.click();

        // Verify regular dashboard is back
        await expect(page.getByPlaceholder('Enter directive...')).toBeVisible();
    });
});
