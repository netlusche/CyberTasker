import { test, expect } from '@playwright/test';
import { calculateBadge } from '../../src/utils/badgeMapping';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { loginAsAdmin } from './auth-commands.js';

test.describe('US-2.5.12 & US-2.5.13: Gamification UX and Logic', () => {



    test('calculateBadge logic should return correct mapped titles based on level', async () => {
        // Test Level 1
        let badge = calculateBadge(1);
        expect(badge.tierKey).toBe('gamification.tier_1');
        expect(badge.titleKey).toBe('gamification.title_1');

        // Test Level 13 (Veteran Netrunner)
        badge = calculateBadge(13);
        expect(badge.tierKey).toBe('gamification.tier_3');
        expect(badge.titleKey).toBe('gamification.title_3');

        // Test Level 25 (Prime Chrome-Junkie)
        badge = calculateBadge(25);
        expect(badge.tierKey).toBe('gamification.tier_5');
        expect(badge.titleKey).toBe('gamification.title_5');

        // Test Level 50 (Prime Singularity Cap)
        badge = calculateBadge(50);
        expect(badge.tierKey).toBe('gamification.tier_5');
        expect(badge.titleKey).toBe('gamification.title_10');

        // Test Level 99 (Should remain capped at 50)
        badge = calculateBadge(99);
        expect(badge.tierKey).toBe('gamification.tier_5');
        expect(badge.titleKey).toBe('gamification.title_10');
    });

    test('should display visual Gamification Badge on Dashboard', async ({ page }) => {
        // 1. Setup a test user directly via API to have specific XP
        // Level 38 requires specifically 3800 XP total to reach based on 100XP per level (or however it is calculated in backend)
        // Actually, let's just log in as a fresh user and check if the basic badge is visible.

        // 1. Login as the pre-seeded Admin_Alpha
        await page.goto('/');

        const loginInputs = page.locator('form input:visible');
        await expect(loginInputs.first()).toBeVisible({ timeout: 10000 });

        const count = await loginInputs.count();
        if (count !== 2) {
            await page.getByTestId('auth-toggle').click();
            await expect(loginInputs).toHaveCount(2, { timeout: 10000 });
        }

        await loginInputs.nth(0).fill('Admin_Alpha');
        await loginInputs.nth(1).fill('Pass_Admin_123!!');
        await page.locator('form button[type="submit"]').click();

        // Check if we hit the 2FA Override screen (due to Enforce Email 2FA being active from other tests)
        // or if we went straight to the dashboard
        const profileBtn = page.getByTestId('profile-btn');
        const mfaHeader = page.getByText(/EMERGENCY OVERRIDE/i);

        await Promise.race([
            profileBtn.waitFor({ state: 'visible', timeout: 15000 }),
            mfaHeader.waitFor({ state: 'visible', timeout: 15000 })
        ]).catch(() => { }); // ignore timeout if one finishes

        if (await mfaHeader.isVisible()) {
            console.log("2FA is enforced. Extracting OTP from email log...");
            await page.waitForTimeout(1000); // Wait for the email hook to write

            const emailLogPath = path.join(process.cwd(), 'api', 'mail_log.txt');
            const emailLogFull = fs.readFileSync(emailLogPath, 'utf8');
            const parts = emailLogFull.split('=== [MAIL ENQUEUED] ===');
            const emailLog = parts.length > 1 ? parts[parts.length - 1] : emailLogFull;

            // The OTP is a 6 digit code in the email log
            // Format usually like: Code: 123456 or simply a 6 digit number
            const codeMatch = emailLog.match(/([0-9]{6})/);
            if (codeMatch) {
                const otp = codeMatch[1];
                const otpInput = page.locator('input[type="text"]').first();
                await otpInput.fill(otp);
                await page.locator('button', { hasText: /VERIFY|OVERRIDE|BESTÄTIGEN/i }).click();
            }
        }

        await expect(profileBtn).toBeVisible({ timeout: 15000 });

        // Verify Gamification badge exists in LevelBar
        const levelBarLocator = page.locator('.lvl-bar-container');
        await expect(levelBarLocator).toBeVisible({ timeout: 5000 });

        const badgeLocator = levelBarLocator.locator('.text-cyber-primary');
        await expect(badgeLocator).toBeVisible();
        const badgeText = await badgeLocator.textContent();
        expect(badgeText.trim().length).toBeGreaterThan(0);

        // Switch Language to Spanish and verify the translation occurs
        const initialBadgeText = badgeText.trim();

        // The language switcher is in the header. We click it and then click 'ES' or Spanish option
        await page.locator('.btn-lang-yellow').click();
        await page.getByRole('button', { name: 'Español' }).click();

        await expect(badgeLocator).not.toHaveText(initialBadgeText, { timeout: 5000 });
    });
});
