import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './auth-commands';

test.describe('Calendar Holo-Projections Limits (Release 2.4)', () => {
    test.beforeEach(async ({ page }) => {
        await loginAsAdmin(page);
        await expect(page.getByTestId('profile-btn')).toBeVisible({ timeout: 15000 });
    });

    test('should generate correct number of projections for Daily recurrence without end date (Limit: 60)', async ({ page }) => {
        const uniqueTitle = `Holo Test Sync ${Date.now()}`;

        // Open New Directive Modal
        await page.locator('body').press('n');
        await page.getByPlaceholder('Enter directive...').fill(uniqueTitle);

        // Set recurrence to Daily
        const recurrenceContainer = page.locator('div', { hasText: 'RECURRENCE:' }).last();
        const recurrenceTrigger = recurrenceContainer.locator('.input-cyber').first();
        await recurrenceTrigger.click();

        // Wait for portal to render and select 'Daily'
        await page.getByText('Daily').click();

        // Save Directive
        await page.getByRole('button', { name: 'ADD', exact: true }).click();
        await expect(page.getByText(uniqueTitle)).toBeVisible();

        // Navigate to Calendar and intercept the API call
        const calendarTrigger = page.locator('button', { hasText: 'CALENDAR' }).first();

        const calendarResponsePromise = page.waitForResponse(response =>
            response.url().includes('route=tasks/calendar') && response.status() === 200
        );

        await calendarTrigger.click();
        const response = await calendarResponsePromise;
        const calendarTasks = await response.json();

        // Filter projections specifically for our new task
        const baseTask = calendarTasks.find(t => t.title === uniqueTitle && !t.is_projection);
        expect(baseTask).toBeDefined();

        const projections = calendarTasks.filter(t => t.title === uniqueTitle && t.is_projection);

        // Validate exactly 60 projections are generated for an unbound daily recurrence
        expect(projections.length).toBe(60);
    });
});
