import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  outputDir: 'output/playwright/test-results',
  use: {
    baseURL: 'http://127.0.0.1:4177',
    headless: true,
    viewport: {
      width: 1600,
      height: 1100,
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 4177 --strictPort',
    url: 'http://127.0.0.1:4177',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
