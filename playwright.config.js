// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: 1, // Enforced sequential execution to prevent SQLite locks and state leakage
    timeout: 60000,
    reporter: 'html',
    use: {
        // Base URL to use in actions like `await page.goto('/')`.
        // The Vite dev server usually runs on 5173 or 5174. 
        baseURL: 'http://localhost:5173',
        trace: 'on-first-retry',
        viewport: { width: 1280, height: 720 },
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        }
    ],

    globalSetup: './tests/global.setup.cjs',

    // webServer: {
    //     command: 'bash start_local.sh',
    //     url: 'http://localhost:5174',
    //     reuseExistingServer: !process.env.CI,
    //     timeout: 30 * 1000,
    // },
});
