import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure', reducedMotion: 'reduce' },
  projects: [
    { name: 'chromium-mobile-414', use: { browserName: 'chromium', viewport: { width: 414, height: 896 }, isMobile: true, hasTouch: true } },
  ],
  webServer: { command: 'npm run build:demo && npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: false, timeout: 120_000 },
})
