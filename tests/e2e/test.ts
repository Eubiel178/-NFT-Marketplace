import { test as base, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await page.evaluate(async () => {
      await fetch('/api/__mock/reset', { method: 'POST' })
    })
    await use(page)
  },
})

export { expect }
export type { Page }
