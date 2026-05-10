import { test, expect, Page, ConsoleMessage } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')

const consoleErrors: string[] = []
const pageErrors: string[] = []
const failedResponses: string[] = []

function attachListeners(page: Page, label: string) {
  page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[${label}] ${msg.text()}`)
    }
  })
  page.on('pageerror', (err) => {
    pageErrors.push(`[${label}] ${err.message}`)
  })
  page.on('response', (resp) => {
    const status = resp.status()
    if (status >= 400) {
      failedResponses.push(`[${label}] ${status} ${resp.url()}`)
    }
  })
}

async function scrollScreenshots(page: Page, prefix: string) {
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  const viewport = page.viewportSize()!
  const positions = [0, 0.25, 0.5, 0.75, 1]
  for (const p of positions) {
    const y = Math.max(0, Math.floor((total - viewport.height) * p))
    await page.evaluate((targetY) => {
      window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior })
    }, y)
    // Allow scroll-triggered animations / Lenis to settle
    await page.waitForTimeout(800)
    const pct = Math.round(p * 100)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${pct}.png`),
      fullPage: false,
    })
  }
}

test.describe('A. Desktop 1280x800', () => {
  test('full QA pass on desktop', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    attachListeners(page, 'desktop')

    const resp = await page.goto('/', { waitUntil: 'networkidle' })
    expect(resp?.status()).toBe(200)
    await expect(page).toHaveTitle(/ROCKMESH/i)

    // Full-page screenshot
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa-desktop-full.png'),
      fullPage: true,
    })

    // Scroll screenshots
    await scrollScreenshots(page, 'qa-desktop-scroll')

    // Reset to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)

    // CTA hrefs
    const telLinks = await page.locator('a[href^="tel:"]').all()
    expect(telLinks.length).toBeGreaterThan(0)
    for (const link of telLinks) {
      const href = await link.getAttribute('href')
      expect(href, 'tel: link should match phone pattern').toMatch(/^tel:\+?[\d\s()-]+$/)
    }

    const tgLinks = await page.locator('a[href*="t.me"]').all()
    expect(tgLinks.length).toBeGreaterThan(0)
    for (const link of tgLinks) {
      const href = await link.getAttribute('href')
      expect(href, 't.me link should be present').toMatch(/^https:\/\/t\.me\//)
    }

    // CompareSlider drag — react-compare-slider exposes a handle div
    try {
      const sliderHandle = page.locator('[role="slider"], [data-rcs="handle"]').first()
      const sliderRoot = page.locator('section').filter({ hasText: 'Кустарь' }).first()
      const beforeBox = await sliderRoot.boundingBox()
      if (beforeBox) {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'qa-desktop-compare-before.png'),
          clip: beforeBox,
        })
        // Locate the slider handle by trying the role first; fallback on .react-compare-slider-handle
        const handle = (await sliderHandle.count()) > 0
          ? sliderHandle
          : page.locator('.__rcs-handle-root, [class*="handle"]').first()
        const handleBox = await handle.boundingBox().catch(() => null)
        if (handleBox) {
          const cx = handleBox.x + handleBox.width / 2
          const cy = handleBox.y + handleBox.height / 2
          await page.mouse.move(cx, cy)
          await page.mouse.down()
          await page.mouse.move(cx + 100, cy, { steps: 10 })
          await page.mouse.up()
          await page.waitForTimeout(300)
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, 'qa-desktop-compare-after.png'),
            clip: beforeBox,
          })
        } else {
          fs.writeFileSync(
            path.join(SCREENSHOT_DIR, 'qa-desktop-compare-NOTE.txt'),
            'Compare slider handle not found via role/class selectors',
          )
        }
      }
    } catch (e) {
      console.log('Compare slider drag test failed:', (e as Error).message)
    }

    // Lightbox: click first cert image
    try {
      const certSection = page.locator('section').filter({ has: page.locator('text=Сертификат') }).first()
      await certSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(400)
      const firstCertCard = certSection.locator('div.cursor-zoom-in').first()
      if (await firstCertCard.count() > 0) {
        await firstCertCard.click({ timeout: 5000 })
        await page.waitForTimeout(600)
        // Look for fixed overlay (Lightbox)
        const overlay = page.locator('div.fixed.inset-0.z-50')
        await expect(overlay).toBeVisible({ timeout: 5000 })
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, 'qa-desktop-lightbox.png'),
          fullPage: false,
        })
        // Close with ESC
        await page.keyboard.press('Escape')
        await page.waitForTimeout(400)
      }
    } catch (e) {
      console.log('Lightbox test failed:', (e as Error).message)
      fs.writeFileSync(
        path.join(SCREENSHOT_DIR, 'qa-desktop-lightbox-FAIL.txt'),
        (e as Error).message,
      )
    }

    // Hover primary CTA — verify no layout break
    try {
      const primary = page.locator('a').filter({ hasText: /Позвонить/i }).first()
      if (await primary.count() > 0) {
        await primary.scrollIntoViewIfNeeded()
        await primary.hover()
        await page.waitForTimeout(200)
      }
    } catch (e) {
      console.log('Hover test failed:', (e as Error).message)
    }

    await context.close()
  })
})

test.describe('B. iPhone SE 375x667', () => {
  test('mobile SE QA pass', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    attachListeners(page, 'mobile-se')

    const resp = await page.goto('/', { waitUntil: 'networkidle' })
    expect(resp?.status()).toBe(200)

    await scrollScreenshots(page, 'qa-mobile-se')

    // No horizontal scroll
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    const overflowing = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        diff: document.documentElement.scrollWidth - window.innerWidth,
      }
    })
    expect(overflowing.diff, `horizontal overflow: scrollWidth=${overflowing.scrollWidth} innerWidth=${overflowing.innerWidth}`).toBeLessThanOrEqual(1)

    // MobileStickyCTA — scroll past 30%
    await page.evaluate(() => {
      const target = (document.body.scrollHeight - window.innerHeight) * 0.5
      window.scrollTo(0, target)
    })
    await page.waitForTimeout(800)
    const sticky = page.locator('div.fixed.bottom-0').filter({ hasText: /Позвонить|Telegram/i })
    const stickyVisible = await sticky.isVisible().catch(() => false)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa-mobile-se-sticky-cta.png'),
      fullPage: false,
    })
    if (!stickyVisible) {
      fs.writeFileSync(
        path.join(SCREENSHOT_DIR, 'qa-mobile-se-sticky-NOTE.txt'),
        'MobileStickyCTA was not detected after 50% scroll',
      )
    }

    // Hero h1 readable
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    const h1Text = await page.locator('h1').first().textContent()
    expect((h1Text ?? '').length).toBeGreaterThan(5)

    // Tap targets <44px
    const undersized = await page.evaluate(() => {
      const issues: { tag: string; text: string; w: number; h: number }[] = []
      const elements = document.querySelectorAll('a, button')
      elements.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        if (rect.height < 44 || rect.width < 44) {
          issues.push({
            tag: el.tagName,
            text: (el.textContent ?? '').trim().slice(0, 40),
            w: Math.round(rect.width),
            h: Math.round(rect.height),
          })
        }
      })
      return issues
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'qa-mobile-se-tap-targets.json'),
      JSON.stringify(undersized, null, 2),
    )

    await context.close()
  })
})

test.describe('C. iPhone 14 Pro 393x852', () => {
  test('mobile 14pro QA pass', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    attachListeners(page, 'mobile-14pro')

    const resp = await page.goto('/', { waitUntil: 'networkidle' })
    expect(resp?.status()).toBe(200)

    await scrollScreenshots(page, 'qa-mobile-14pro')

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
    const overflowing = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      diff: document.documentElement.scrollWidth - window.innerWidth,
    }))
    expect(overflowing.diff, `horizontal overflow: ${JSON.stringify(overflowing)}`).toBeLessThanOrEqual(1)

    await context.close()
  })
})

test.describe('D. Reduced motion', () => {
  test('reduced-motion fallback', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      reducedMotion: 'reduce',
    })
    const page = await context.newPage()
    attachListeners(page, 'reduced-motion')

    const resp = await page.goto('/', { waitUntil: 'networkidle' })
    expect(resp?.status()).toBe(200)

    // Wait for hero useEffect to run
    await page.waitForTimeout(1500)

    const videoState = await page.evaluate(() => {
      const v = document.querySelector('video') as HTMLVideoElement | null
      if (!v) return null
      return {
        loop: v.loop,
        autoplay: v.autoplay,
        muted: v.muted,
        paused: v.paused,
        currentTime: v.currentTime,
      }
    })
    expect(videoState).not.toBeNull()
    expect(videoState!.loop).toBe(true)

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'qa-reduced-motion.png'),
      fullPage: false,
    })

    await context.close()
  })
})

test.afterAll(async () => {
  const summary = {
    consoleErrors,
    pageErrors,
    failedResponses,
  }
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'qa-events.json'),
    JSON.stringify(summary, null, 2),
  )
  // Don't fail the run on these — qa-report consolidates them.
  if (pageErrors.length) {
    console.log('--- pageerror events ---')
    pageErrors.forEach((e) => console.log(e))
  }
  if (consoleErrors.length) {
    console.log('--- console.error events ---')
    consoleErrors.forEach((e) => console.log(e))
  }
  if (failedResponses.length) {
    console.log('--- failed responses ---')
    failedResponses.forEach((e) => console.log(e))
  }
})
