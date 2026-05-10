import { test, expect, Page } from '@playwright/test'
import path from 'node:path'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const BASE_URL = 'http://localhost:3001/'
const VERSION = 'v8local'

async function shootSection(page: Page, selector: string, name: string, viewport: string) {
  const el = page.locator(selector).first()
  if ((await el.count()) === 0) return
  await page.evaluate((sel) => {
    const node = document.querySelector(sel) as HTMLElement | null
    if (node) node.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
  }, selector)
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${VERSION}-${viewport}-${name}.png`), fullPage: false })
}

test('Desktop 1280 — fix verification', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
  expect(resp?.status()).toBe(200)
  await page.waitForTimeout(2000)

  // Hero scroll 0%
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-0.png`), fullPage: false })

  for (const [sel, name] of [
    ['#specs', 'specs'],
    ['#manufacturer', 'manufacturer'],
    ['#delivery', 'delivery'],
    ['#hero', 'hero'],
    ['#reviews', 'reviews'],
  ] as const) {
    await shootSection(page, sel, name, 'desktop')
  }

  await ctx.close()
})

test('Mobile SE — fix verification', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  })
  const page = await ctx.newPage()
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30_000 })
  await page.waitForTimeout(2000)

  // Trigger sticky CTA
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-sticky.png`), fullPage: false })

  for (const [sel, name] of [
    ['#manufacturer', 'manufacturer'],
    ['#delivery', 'delivery'],
    ['#specs', 'specs'],
  ] as const) {
    await shootSection(page, sel, name, 'mobile-se')
  }

  await ctx.close()
})
