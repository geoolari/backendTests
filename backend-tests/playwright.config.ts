import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests-api',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'html',
});
