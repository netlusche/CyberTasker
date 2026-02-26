import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

test.describe('TS-12.9: Installer Custom Admin Provisioning', () => {

    test.beforeAll(() => {
        // Run a PHP script to drop all tables, simulating a fresh environment
        // for both SQLite and MariaDB across all test environments
        console.log('00-installer.spec.js: Wiping database tables for fresh install...');
        execSync('php tests/e2e_wipe_db.php', { stdio: 'inherit' });
    });

    test.afterAll(() => {
        // Re-seed the database so subsequent tests (01-auth.spec.js, etc.) 
        // have their required Admin_Alpha and Op_Beta users.
        console.log('00-installer.spec.js: Re-seeding database for subsequent test suites...');
        // Run install.php via CLI first to guarantee table schema exists (in case the browser part failed)
        execSync('php api/install.php > /dev/null 2>&1');
        execSync('php tests/seed_test_data.php', { stdio: 'inherit' });
    });

    test('Should successfully provision a custom Master Account and reject default setup', async ({ page }) => {
        // Navigate directly to the installer
        await page.goto('/install.html');

        // Verify the installer UI loaded
        const usernameInput = page.locator('#admin-username');
        await expect(usernameInput).toBeVisible({ timeout: 10000 });

        // Fill out the provisioning form
        await page.locator('#admin-username').fill('CyberBoss');
        await page.locator('#admin-email').fill('cyberboss@cybertasker.local');
        await page.locator('#admin-password').fill('SecureMasterKey123!!');
        await page.locator('#confirm-password').fill('SecureMasterKey123!!');

        // Select English to ensure predictable rendering of success text
        await page.locator('#lang-select').selectOption('en');

        // Submit the form
        await page.locator('button[onclick="initializeSystem()"]').click();

        // Wait for the success message injected by install.php / React
        const successMessage = page.locator('.success');
        await expect(successMessage).toBeVisible({ timeout: 15000 });

        // Ensure the "PROCEED TO LOGIN" link is visible
        const proceedLink = page.locator('a', { hasText: /PROCEED TO LOGIN|WEITER ZUM ANMELDEN/i });
        await expect(proceedLink).toBeVisible();
    });

    test('Should reject subsequent initialization attempts to prevent privilege escalation', async ({ page }) => {
        // This test runs after the first one, meaning the 'users' table already exists.
        await page.goto('/install.html');

        await page.locator('#admin-username').fill('RogueHacker');
        await page.locator('#admin-email').fill('rogue@hacker.local');
        await page.locator('#admin-password').fill('pwned123!!');
        await page.locator('#confirm-password').fill('pwned123!!');

        // Capture the API response to assert 403 Forbidden
        const responsePromise = page.waitForResponse(response =>
            response.url().includes('api/install.php') && response.request().method() === 'POST'
        );

        await page.locator('button[onclick="initializeSystem()"]').click();
        const response = await responsePromise;
        const json = await response.json();

        expect(response.status()).toBe(403);
        expect(json.error).toContain('[ ACCESS DENIED: SECURITY AUTO-LOCK ]');

        // Ensure the UI displays the error
        const errorMessage = page.locator('.error', { hasText: /Unauthorized access/i });
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
    });
});
