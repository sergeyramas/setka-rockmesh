import { test, expect, Page, ConsoleMessage } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const BASE_URL = 'https://setka-rockmesh.vercel.app/'
const VERSION = 'v8prod'

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
    if (msg.type() === 'error') events.consoleErrors.push(`[${label}] ${msg.text()}`)
    else if (msg.type() === 'warning') events.consoleWarnings.push(`[${label}] ${msg.text()}`)
  })
  page.on('pageerror', (err) => {
    events.pageErrors.push(`[${label}] ${err.message}`)
  })
  page.on('response', (resp) => {
    const status = resp.status()
    if (status >= 400) events.failedResponses.push(`[${label}] ${status} ${resp.url()}`)
  })
}

async function scrollAndShoot(page: Page, prefix: string) {
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
    await page.waitForTimeout(1500)
    const pct = Math.round(p * 100)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${pct}.png`),
      fullPage: false,
    })
  }
}

async function shootSection(page: Page, selector: string, name: string) {
  const el = page.locator(selector).first()
  if ((await el.count()) === 0) return false
  await page.evaluate((sel) => {
    const node = document.querySelector(sel) as HTMLElement | null
    if (node) node.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
  }, selector)
  await page.waitForTimeout(1200)
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-${name}.png`),
    fullPage: false,
  })
  return true
}

test.describe(`${VERSION}: prod baseline (v7 deployed)`, () => {
  test('Desktop 1280x800', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    attachListeners(page, 'desktop')

    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, `${VERSION}-desktop`)

    // Section close-ups (focus on bug zones from v8-handoff)
    const sections = [
      ['#hero', 'hero'],
      ['#tech-specs', 'specs'],
      ['#specs', 'specs2'],
      ['#manufacturer', 'manufacturer'],
      ['#delivery', 'delivery'],
      ['#composition', 'composition'],
      ['#certificates', 'certificates'],
      ['#reviews', 'reviews'],
    ] as const

    const sectionsHit: Record<string, boolean> = {}
    for (const [sel, name] of sections) {
      sectionsHit[name] = await shootSection(page, sel, name)
    }

    // Layout audit — measure key elements' bounding boxes
    const layout = await page.evaluate(() => {
      const out: Record<string, unknown> = {}
      const measure = (sel: string) => {
        const el = document.querySelector(sel) as HTMLElement | null
        if (!el) return null
        const r = el.getBoundingClientRect()
        return {
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          top: Math.round(r.top),
        }
      }
      out.viewportWidth = window.innerWidth
      out.docScrollWidth = document.documentElement.scrollWidth
      out.h1 = measure('h1')
      out.heroSection = measure('section[aria-label*="Hero" i], #hero, main > section:first-child')
      out.marketplaceCard = measure('[class*="marketplaceCard"], [class*="card_"], [class*="Card_"]')
      out.heroH2 = measure('h2')
      out.delivery = measure('#delivery')
      out.manufacturer = measure('#manufacturer')
      out.specs = measure('#tech-specs, #specs')
      // sections list with id + width
      const sections = Array.from(document.querySelectorAll('section')) as HTMLElement[]
      out.sectionsCount = sections.length
      out.sectionsBoxes = sections.slice(0, 20).map((s) => {
        const r = s.getBoundingClientRect()
        return { id: s.id || null, width: Math.round(r.width), top: Math.round(r.top) }
      })
      return out
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-desktop-layout.json`),
      JSON.stringify({ sectionsHit, layout }, null, 2)
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

    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, `${VERSION}-mobile-se`)

    // Mobile sticky CTA snapshot
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5))
    await page.waitForTimeout(1500)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-sticky-cta.png`),
      fullPage: false,
    })

    // Sticky CTA color audit
    const stickyAudit = await page.evaluate(() => {
      const candidates = Array.from(document.querySelectorAll('[class*="sticky"], [class*="Sticky"], [class*="MobileSticky"]')) as HTMLElement[]
      return candidates.map((c) => {
        const buttons = Array.from(c.querySelectorAll('a, button')) as HTMLElement[]
        return {
          class: c.className,
          buttons: buttons.map((b) => ({
            text: (b.textContent || '').trim().slice(0, 40),
            bg: getComputedStyle(b).backgroundColor,
            color: getComputedStyle(b).color,
            borderColor: getComputedStyle(b).borderColor,
          })),
        }
      })
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-sticky-cta.json`),
      JSON.stringify(stickyAudit, null, 2)
    )

    // Composition / sticky white-gap audit at 25%
    await page.evaluate(() => window.scrollTo(0, Math.floor(document.documentElement.scrollHeight * 0.25)))
    await page.waitForTimeout(1200)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-25-recap.png`),
      fullPage: false,
    })

    // Overflow check
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      hasHOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    }))
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-overflow.json`),
      JSON.stringify(overflow, null, 2)
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

    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, `${VERSION}-mobile-14pro`)

    await context.close()
  })

  test.afterAll(async () => {
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-events.json`),
      JSON.stringify(events, null, 2)
    )
  })
})
