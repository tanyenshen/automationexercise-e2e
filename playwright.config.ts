import { defineConfig, devices } from '@playwright/test';


export default defineConfig({
    testDir: './tests',
    timeout: 90_000,
    expect: { timeout: 5000 },
    fullyParallel: false,
    retries: 1,
    reporter: [
        ['list'],
        ['html', { open: 'never', outputFolder: 'playwright-report' }]
    ],
    use: {
        baseURL: 'https://automationexercise.com',
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    ]
});