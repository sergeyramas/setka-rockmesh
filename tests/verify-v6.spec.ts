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
  // wait extra for hero canvas frames to load + sticky header init
  await page.waitForTimeout(4000)

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
    await page.waitForTimeout(1500)
    const pct = Math.round(p * 100)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${pct}.png`),
      fullPage: false,
    })
  }
}

test.describe('VERIFY v6: header + callback modal + delivery map', () => {
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

    await scrollAndShoot(page, 'v6-desktop')

    // Reset to top to test header
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(800)

    // Header at top
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'v6-desktop-header-top.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 120 },
    })

    // Scroll to 50% — header should still be sticky
    const totalH = await page.evaluate(() => document.documentElement.scrollHeight)
    const vh = await page.evaluate(() => window.innerHeight)
    const target50 = Math.floor((totalH - vh) * 0.5)
    await page.evaluate((y) => window.scrollTo(0, y), target50)
    await page.waitForTimeout(1000)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'v6-desktop-header-sticky.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 1280, height: 120 },
    })

    // Hover over a nav link
    const navLink = page.locator('header a, nav a').filter({ hasText: /Сравнение|Состав|Применение|Характеристики|Производитель|Доставка/i }).first()
    if (await navLink.count()) {
      await navLink.hover()
      await page.waitForTimeout(500)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-nav-hover.png'),
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 120 },
      })
    }

    // Click "Обратный звонок" button → modal opens
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    const callbackBtn = page.locator('button:has-text("Обратный звонок"), a:has-text("Обратный звонок")').first()
    if (await callbackBtn.count()) {
      await callbackBtn.click()
      await page.waitForTimeout(800)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-callback-modal.png'),
        fullPage: false,
      })

      // Click outside to close
      await page.mouse.click(50, 50)
      await page.waitForTimeout(500)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-callback-closed.png'),
        fullPage: false,
        clip: { x: 0, y: 0, width: 1280, height: 200 },
      })
    } else {
      fs.writeFileSync(
        path.join(SCREENSHOT_DIR, 'v6-desktop-callback-MISSING.txt'),
        'Обратный звонок button not found'
      )
    }

    // Delivery section close-up
    const deliverySection = page.locator('#delivery, [data-section="delivery"], section:has-text("Доставка")').first()
    if (await deliverySection.count()) {
      await deliverySection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(2000) // wait for route animations
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-delivery-closeup.png'),
        fullPage: false,
      })
    }

    // Composition section — should have NO grey stub
    const compositionSection = page.locator('#composition, section:has-text("Состав")').first()
    if (await compositionSection.count()) {
      await compositionSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(800)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-composition-closeup.png'),
        fullPage: false,
      })
    }

    // Manufacturer section — should have NO PLACEHOLDER badge
    const manufacturerSection = page.locator('#manufacturer, section:has-text("Производитель"), section:has-text("Гален")').first()
    if (await manufacturerSection.count()) {
      await manufacturerSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(800)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-manufacturer-closeup.png'),
        fullPage: false,
      })
    }

    // TechSpecs price — should show 150
    const techSpecsSection = page.locator('#tech-specs, [data-section="tech-specs"], section:has-text("150 ₽")').first()
    if (await techSpecsSection.count()) {
      await techSpecsSection.scrollIntoViewIfNeeded()
      await page.waitForTimeout(1500)
      await page.screenshot({
        path: path.join(SCREENSHOT_DIR, 'v6-desktop-techspecs-closeup.png'),
        fullPage: false,
      })
    }

    // Detect "PLACEHOLDER" text presence anywhere
    const hasPlaceholder = await page.evaluate(() => {
      return document.body.innerText.includes('PLACEHOLDER')
    })
    // Detect "Здесь будет интерактивная разборка" text presence
    const hasStub = await page.evaluate(() => {
      return document.body.innerText.includes('Здесь будет интерактивная разборка')
    })
    // Detect emoji 📞 or 💬 presence
    const hasPhoneEmoji = await page.evaluate(() => {
      return document.body.innerText.includes('📞')
    })
    const hasChatEmoji = await page.evaluate(() => {
      return document.body.innerText.includes('💬')
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'v6-desktop-text-checks.json'),
      JSON.stringify({ hasPlaceholder, hasStub, hasPhoneEmoji, hasChatEmoji }, null, 2)
    )

    // Cursor: check that body doesn't have cursor: none
    const bodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor)
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'v6-desktop-cursor.json'),
      JSON.stringify({ bodyCursor }, null, 2)
    )

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

    await scrollAndShoot(page, 'v6-mobile-se')

    // Mobile header close-up at top
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'v6-mobile-se-header.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 100 },
    })

    // Scroll to mid — sticky header
    const totalH = await page.evaluate(() => document.documentElement.scrollHeight)
    const vh = await page.evaluate(() => window.innerHeight)
    const target50 = Math.floor((totalH - vh) * 0.5)
    await page.evaluate((y) => window.scrollTo(0, y), target50)
    await page.waitForTimeout(800)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'v6-mobile-se-header-sticky.png'),
      fullPage: false,
      clip: { x: 0, y: 0, width: 375, height: 100 },
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
      path.join(SCREENSHOT_DIR, 'v6-mobile-se-tap-targets.json'),
      JSON.stringify(taps, null, 2)
    )

    // horizontal overflow check
    const hasHOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1
    )
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'v6-mobile-se-overflow.json'),
      JSON.stringify({ hasHOverflow, scrollWidth: 0, viewWidth: 375 }, null, 2)
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

    await scrollAndShoot(page, 'v6-mobile-14pro')

    await context.close()
  })

  test.afterAll(async () => {
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, 'v6-events.json'),
      JSON.stringify(events, null, 2)
    )
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
