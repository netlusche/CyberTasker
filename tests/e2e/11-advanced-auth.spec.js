import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { loginAsAdmin } from './auth-commands.js';

// Helper to get the latest email content
function getLatestEmailContent() {
    const logPath = path.join(process.cwd(), 'api/mail_log.txt');
    if (!fs.existsSync(logPath)) return null;
    return fs.readFileSync(logPath, 'utf8');
}

// Helper to clear the email log before a test step
function clearEmailLog() {
    const logPath = path.join(process.cwd(), 'api/mail_log.txt');
    if (fs.existsSync(logPath)) {
        fs.unlinkSync(logPath);
    }
}

test.describe('TS-08: Advanced Authentication & Security Protocols', () => {

    test.beforeAll(async () => {
        // Reset the database before testing 2FA flows to avoid cascading locked states
        try {
            execSync('php tests/seed_test_data.php', { stdio: 'inherit' });
        } catch (error) {
            console.error('Seed script failed:', error.message);
            // Retry once just in case of transient DB lock
            execSync('php tests/seed_test_data.php', { stdio: 'inherit' });
        }
    });

    test.beforeEach(async () => {
        clearEmailLog();
    });

    test('TS-08.1: Full Registration & Email Verification Flow', async ({ page }) => {
        await page.goto('/');

        // Switch to registration mode
        await page.locator('button.decoration-dotted', { hasText: /No Identity|Keine Identit.t|Establish|Neu/i }).click();

        const testUser = `agent_${Date.now()}`;
        const email = `${testUser}@test-mail.local`;
        const password = 'SecurePass_123!!';

        const inputs = page.locator('form input');
        await inputs.nth(0).fill(testUser);
        await inputs.nth(1).fill(email);
        await inputs.nth(2).fill(password);

        await page.locator('form button[type="submit"]').click();

        // Wait for success alert and read its text
        const alertBox = page.getByTestId('cyber-alert');
        await expect(alertBox).toBeVisible({ timeout: 15000 });
        const alertText = await alertBox.textContent();
        console.log('ALERT BOX TEXT: ' + alertText);
        expect(alertText).toMatch(/registered|ESTABLISHED/i); // Should contain part of the success message
        await alertBox.getByTestId('alert-acknowledge').click();

        // Give it a moment to write to the log
        await page.waitForTimeout(2000);

        const mailContent = getLatestEmailContent();
        expect(mailContent).toContain(testUser);
        expect(mailContent).toContain('/verify.html?token=');

        // Extract the verification link
        const match = mailContent.match(/href='([^']+)'/);
        expect(match).toBeTruthy();
        const verifyLink = match[1];

        // Format link to avoid internal proxy URL
        const verifyUrlObj = new URL(verifyLink);
        const verifyPath = verifyUrlObj.pathname + verifyUrlObj.search;

        // Navigate to verify link (using base URL automatically)
        await page.goto(verifyPath);

        // Wait for system to say verified
        await expect(page.locator('body')).toContainText(/Account verified|Identity verified|erfolgreich/i, { timeout: 10000 });

        // Go back to login and log in with the newly verified account
        await page.goto('/');
        await page.locator('form input').nth(0).fill(testUser);
        await page.locator('form input').nth(1).fill(password);
        await page.locator('form button[type="submit"]').click();

        const profileBtn = page.getByTestId('profile-btn');
        await expect(profileBtn).toBeVisible({ timeout: 10000 });
    });

    test('TS-08.2: Enable, Trigger, and Use Email 2FA (Bio-Lock)', async ({ page }) => {
        // We use Admin_Alpha seeded by seed_test_data.php
        await loginAsAdmin(page);

        const profileBtn = page.getByTestId('profile-btn');
        await expect(profileBtn).toBeVisible({ timeout: 10000 });

        // Open Profile
        await profileBtn.click();
        await expect(page.getByTestId('modal-title')).toBeVisible();

        // Wait for animations and click Email Security
        await page.waitForTimeout(1000);
        const emailSecurityBtn = page.locator('button', { hasText: /EMAIL SECURITY|EMAIL UPLINK/i });
        await emailSecurityBtn.click();

        // Wait for 2FA Transmission Sent
        await page.waitForTimeout(2000);
        const mailContent = getLatestEmailContent();
        expect(mailContent).toBeTruthy();

        // Extract 6 digit code from the email HTML (the <b ...>123456</b>)
        const codeMatch = mailContent.match(/<b[^>]*>(\d{6})<\/b>/);
        expect(codeMatch).toBeTruthy();
        const code = codeMatch[1];

        // Fill the setup code verification field
        const codeInput = page.locator('input[placeholder*="CODE"]');
        await expect(codeInput).toBeVisible();
        await codeInput.fill(code);

        // Click Bridge / Verify 
        await page.locator('button', { hasText: /BRIDGE/i }).click();

        // Verify it says "Active"
        await expect(page.locator('text=/EMAIL UPLINK SECURED|UPLINK SECURED/i')).toBeVisible({ timeout: 5000 });

        // Ensure Backup codes modal closed / confirmed (It shows an alert or UI)
        // If there's an alert modal, acknowledge it
        if (await page.getByTestId('cyber-alert').isVisible()) {
            await page.getByTestId('alert-acknowledge').click();
        }

        // --- Log out and Login to Trigger 2FA ---
        await page.getByTestId('profile-close-btn').click();
        await page.locator('button', { hasText: /LOGOUT|ABMELDEN|DISCONNECT/i }).click();

        // Refresh to ensure clean state
        await page.goto('/');
        clearEmailLog();

        await expect(page.getByText(/INITIALIZING SYSTEM|SYSTEM INITIALISIERUNG/i)).not.toBeVisible({ timeout: 15000 });

        const visibleInputs = page.locator('form input:visible');
        await expect(visibleInputs.first()).toBeVisible({ timeout: 10000 });

        const count = await visibleInputs.count();
        if (count !== 2) {
            await page.getByTestId('auth-toggle').click();
            await expect(visibleInputs).toHaveCount(2, { timeout: 10000 });
        }

        await visibleInputs.nth(0).fill('Admin_Alpha');
        await visibleInputs.nth(1).fill('Pass_Admin_123!!');
        await page.locator('form button[type="submit"]').click();

        // It should prompt for verification code now
        await expect(page.locator('text=/VERIFY IDENTITY|VERIFY ACCESS CODE/i').first()).toBeVisible({ timeout: 10000 });

        // Read email again for login 2FA
        await page.waitForTimeout(2000);
        const loginMail = getLatestEmailContent();
        expect(loginMail).toBeTruthy();
        const loginCodeMatch = loginMail.match(/<b[^>]*>(\d{6})<\/b>/);
        expect(loginCodeMatch).toBeTruthy();
        const loginCode = loginCodeMatch[1];

        // Fill code
        await page.locator('input[type="text"]').fill(loginCode);
        await page.locator('button[type="submit"]').click();

        // Check dashboard loaded
        await expect(page.getByTestId('profile-btn')).toBeVisible({ timeout: 10000 });

        // Teardown: Disable 2FA so it doesn't break other tests
        await page.getByTestId('profile-btn').click();
        await page.waitForTimeout(1000);
        await page.locator('button', { hasText: /TERMINATE SECURITY PROTOCOLS|TERMINATE/i }).first().click();
        // CyberConfirm modal
        await page.getByTestId('confirm-button').click();
        await expect(page.locator('text=/DISABLED/i').first()).toBeVisible({ timeout: 5000 });
    });
});
