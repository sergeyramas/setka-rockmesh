import { test, expect, Page } from '@playwright/test'
import path from 'node:path'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const BASE_URL = process.env.V9_BASE_URL ?? 'http://localhost:3001/'

test('Mobile 375px — no regression', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const page = await ctx.newPage()
  const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
  expect(resp?.status()).toBe(200)
  await page.waitForTimeout(2500)

  for (const p of [0, 0.2, 0.4, 0.6, 0.8]) {
    const y = await page.evaluate((pct) => {
      const total = document.documentElement.scrollHeight
      const vh = window.innerHeight
      return Math.max(0, Math.floor((total - vh) * pct))
    }, p)
    await page.evaluate((targetY) => window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior }), y)
    await page.waitForTimeout(800)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `v9shell-375-${Math.round(p * 100)}.png`),
      fullPage: false,
    })
  }

  // Check for horizontal overflow
  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.scrollWidth
    const winW = window.innerWidth
    return { docW, winW, overflows: docW > winW + 1 }
  })
  expect(overflow.overflows, `Horizontal overflow at 375px: doc=${overflow.docW} win=${overflow.winW}`).toBe(false)

  await ctx.close()
})
