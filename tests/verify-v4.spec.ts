import { test, expect, Page, ConsoleMessage } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const PROD_URL = 'https://setka-rockmesh.vercel.app/'

type EventLog = {
  consoleErrors: string[]
  consoleWarnings: string[]
  pageErrors: string[]
  failedResponses: string[]
}

const events: EventLog = {
  consoleErrors: [],
  consoleWarnings: [],
  pageErrors: [],
  failedResponses: [],
}

function attachListeners(page: Page, label: string) {
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      events.consoleErrors.push(`[${label}] ${msg.text()}`)
    } else if (msg.type() === 'warning') {
      events.consoleWarnings.push(`[${label}] ${msg.text()}`)
    }
  })
  page.on('pageerror', (err) => {
    events.pageErrors.push(`[${label}] ${err.message}`)
  })
  page.on('response', (resp) => {
    const status = resp.status()
    if (status >= 400) {
      events.failedResponses.push(`[${label}] ${status} ${resp.url()}`)
    }
  })
}

async function scrollAndShoot(page: Page, prefix: string) {
  // wait extra for hero canvas frames to load
  await page.waitForTimeout(3000)

  const positions = [0, 0.25, 0.5, 0.75, 1]
  for (const p of positions) {
    const y = await page.evaluate((pct) => {
      const total = document.documentElement.scrollHeight
      const vh = window.innerHeight
      return Math.max(0, Math.floor((total - vh) * pct))
    }, p)

    await page.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })
    }, y)
    // Settle scroll-triggered animations + lenis
    await page.waitForTimeout(1200)
    const pct = Math.round(p * 100)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${pct}.png`),
      fullPage: false,
    })
  }
}

test.describe('VERIFY v4: light Allegro theme + canvas hero', () => {
  test('Desktop 1280x800', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    attachListeners(page, 'desktop')

    const resp = await page.goto(PROD_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)
    await expect(page).toHaveTitle(/ROCKMESH/i)

    await scrollAndShoot(page, 'verify-desktop')

    // Reset
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    // CompareSlider drag interaction (if present)
    const sliderHandle = page.locator('[data-testid="compare-slider-handle"], [aria-label*="ползунок" i], [role="slider"]').first()
    if (await sliderHandle.count()) {
      const box = await sliderHandle.boundingBox()
      if (box) {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'verify-desktop-slider-before.png'),
          fullPage: false,
        })
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await page.mouse.down()
        await page.mouse.move(box.x + box.width / 2 - 200, box.y + box.height / 2, { steps: 10 })
        await page.mouse.up()
        await page.waitForTimeout(400)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'verify-desktop-slider-after.png'),
          fullPage: false,
        })
      }
    }

    // Lightbox: click first certificate image
    const certImg = page.locator('section:has-text("Сертификаты"), section:has-text("сертификат"), [data-section="certificates"]').locator('img, button').first()
    if (await certImg.count()) {
      const box = await certImg.boundingBox()
      if (box) {
        await certImg.scrollIntoViewIfNeeded()
        await page.waitForTimeout(400)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'verify-desktop-cert-before.png'),
          fullPage: false,
        })
        await certImg.click({ trial: false }).catch(() => {})
        await page.waitForTimeout(800)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'verify-desktop-cert-lightbox.png'),
          fullPage: false,
        })
        await page.keyboard.press('Escape').catch(() => {})
        await page.waitForTimeout(300)
      }
    }

    // MagneticButton hover (any prominent CTA)
    const cta = page.locator('a:has-text("Позвонить"), a:has-text("Telegram"), button:has-text("Позвонить")').first()
    if (await cta.count()) {
      await cta.scrollIntoViewIfNeeded()
      await page.waitForTimeout(300)
      const box = await cta.boundingBox()
      if (box) {
        await page.mouse.move(box.x + box.width / 2 + 30, box.y + box.height / 2 + 10)
        await page.waitForTimeout(400)
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'verify-desktop-cta-hover.png'),
          fullPage: false,
        })
      }
    }

    await context.close()
  })

  test('iPhone SE 375x667', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    })
    const page = await context.newPage()
    attachListeners(page, 'mobile-se')

    const resp = await page.goto(PROD_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, 'verify-mobile-se')

    // Check for sticky CTA after 30% scroll
    const totalH = await page.evaluate(() => document.documentElement.scrollHeight)
    const vh = await page.evaluate(() => window.innerHeight)
    const target35 = Math.floor((totalH - vh) * 0.35)
    await page.evaluate((y) => window.scrollTo(0, y), target35)
    await page.waitForTimeout(800)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'verify-mobile-se-sticky-cta-check.png'),
      fullPage: false,
    })

    // Tap target audit
    const taps = await page.evaluate(() => {
      const els = Array.from(
        document.querySelectorAll('a, button, [role="button"]')
      ) as HTMLElement[]
      const small: { tag: string; text: string; w: number; h: number }[] = []
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) return
        if (r.width < 44 || r.height < 44) {
          small.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || '').trim().slice(0, 30),
            w: Math.round(r.width),
            h: Math.round(r.height),
          })
        }
      })
      return small.slice(0, 30)
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'verify-mobile-se-tap-targets.json'),
      JSON.stringify(taps, null, 2)
    )

    // horizontal overflow check
    const hasHOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    )
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'verify-mobile-se-overflow.json'),
      JSON.stringify({ hasHOverflow }, null, 2)
    )

    await context.close()
  })

  test('iPhone 14 Pro 393x852', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    })
    const page = await context.newPage()
    attachListeners(page, 'mobile-14pro')

    const resp = await page.goto(PROD_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, 'verify-mobile-14pro')

    await context.close()
  })

  test.afterAll(async () => {
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'verify-events.json'),
      JSON.stringify(events, null, 2)
    )
    // Don't auto-fail on warnings; report-only.
    if (events.pageErrors.length > 0) {
      console.warn('PAGE ERRORS:', events.pageErrors)
    }
    if (events.consoleErrors.length > 0) {
      console.warn('CONSOLE ERRORS:', events.consoleErrors)
    }
    if (events.failedResponses.length > 0) {
      console.warn('FAILED RESPONSES:', events.failedResponses)
    }
  })
})
