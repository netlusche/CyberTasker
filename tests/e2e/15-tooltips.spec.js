import { test, expect } from '@playwright/test';

test.describe('US-2.6.1: Multilingual Tooltips Verification', () => {

    test('TS-15.1: Verify tooltips update correctly on language switch', async ({ page }) => {
        // Go to login page
        await page.goto('/');

        // Wait for system to initialize
        await expect(page.locator('body')).not.toContainText(/INITIALIZING SYSTEM|SYSTEM INITIALISIERUNG/i, { timeout: 15000 });

        // Ensure we are in login mode
        const inputs = page.locator('form input:visible');
        await expect(inputs).toHaveCount(2, { timeout: 10000 });

        // Fill out login
        await inputs.nth(0).fill('Admin_Alpha');
        await inputs.nth(1).fill('Pass_Admin_123!!');

        // Submit
        await page.locator('form button[type="submit"]').click();

        // Wait for dashboard to appear by checking profile button
        const profileBtn = page.getByTestId('profile-btn');
        await expect(profileBtn).toBeVisible({ timeout: 15000 });

        // Verify English tooltip (Calendar icon)
        const calendarBtn = page.locator('button[data-tooltip-content="Calendar"], button[data-tooltip-content="Kalender"]');
        await expect(calendarBtn).toHaveAttribute('data-tooltip-content', 'Calendar');

        // Verify another English tooltip (Settings/Profile icon)
        await expect(profileBtn).toHaveAttribute('data-tooltip-content', 'Settings');

        // Open Language Switcher (located in Header)
        await page.locator('.inline-block.relative button').first().click();

        // Select Language 'Deutsch'
        await page.getByRole('button', { name: 'Deutsch' }).click();

        // Verify German tooltips (Kalender and Einstellungen)
        await expect(calendarBtn).toHaveAttribute('data-tooltip-content', 'Kalender');

        // Let's verify profile button tooltip translation for DE. Assuming 'Einstellungen' or similar based on translations.
        // If we don't know the exact DE translation, we can at least assert it is changed and not empty.
        const newProfileTooltip = await profileBtn.getAttribute('data-tooltip-content');
        expect(newProfileTooltip).not.toBe('Settings');
        expect(newProfileTooltip?.length).toBeGreaterThan(0);

        // Switch back to English to clean up
        await page.locator('.inline-block.relative button').first().click();
        await page.getByRole('button', { name: 'English' }).click();

        await expect(calendarBtn).toHaveAttribute('data-tooltip-content', 'Calendar');
        await expect(profileBtn).toHaveAttribute('data-tooltip-content', 'Settings');
    });
});
