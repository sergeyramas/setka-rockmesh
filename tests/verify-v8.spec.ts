import { test, expect, Page, ConsoleMessage } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const BASE_URL = 'http://localhost:3000/'
const VERSION = 'v8'

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
  page.on('pageerror', (err) => events.pageErrors.push(`[${label}] ${err.message}`))
  page.on('response', (resp) => {
    const status = resp.status()
    if (status >= 400) events.failedResponses.push(`[${label}] ${status} ${resp.url()}`)
  })
}

async function scrollAndShoot(page: Page, prefix: string) {
  await page.waitForTimeout(2500)
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
    await page.waitForTimeout(1200)
    const pct = Math.round(p * 100)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${pct}.png`),
      fullPage: false,
    })
  }
}

async function focusCalculator(page: Page) {
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'))
    const calcHeading = headings.find((h) => (h.textContent || '').includes('Калькулятор доставки'))
    if (calcHeading) calcHeading.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior })
  })
  await page.waitForTimeout(800)
}

test.describe(`VERIFY ${VERSION}: DeliveryCalculator embed (localhost)`, () => {
  test('Desktop 1280x800', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    attachListeners(page, 'desktop')

    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)
    await expect(page).toHaveTitle(/ROCKMESH/i)

    await scrollAndShoot(page, `${VERSION}-desktop`)

    // 1. Verify calculator presence and copy edits
    const calcAudit = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2'))
      const calcH = headings.find((h) => (h.textContent || '').includes('Калькулятор доставки'))
      const eyebrow = Array.from(document.querySelectorAll('p')).find(
        (p) => (p.textContent || '').trim() === 'Расчёт доставки'
      )
      const draftBadge = Array.from(document.querySelectorAll('p')).find(
        (p) => (p.textContent || '').trim() === 'Черновой модуль'
      )
      const internalNote = document.body.innerText.includes('Онлайн-API ТК подключается')
      const publicCopy = document.body.innerText.includes('Подберите город, размер карты и количество')
      return {
        headingExists: !!calcH,
        headingTag: calcH ? calcH.tagName.toLowerCase() : null,
        headingText: calcH ? (calcH.textContent || '').trim() : null,
        eyebrowExists: !!eyebrow,
        draftBadgeStillThere: !!draftBadge,
        internalNoteStillThere: internalNote,
        publicCopyExists: publicCopy,
      }
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-audit.json`),
      JSON.stringify(calcAudit, null, 2)
    )

    // 2. Position check: calculator between Delivery and FinalCTA
    const orderAudit = await page.evaluate(() => {
      const sections = Array.from(document.querySelectorAll('main > section')) as HTMLElement[]
      const sigs = sections.map((s, i) => {
        const txt = (s.textContent || '').slice(0, 200)
        let label = `section-${i}`
        if (s.id === 'delivery') label = 'Delivery'
        else if (txt.includes('Калькулятор доставки')) label = 'DeliveryCalculator'
        else if (txt.includes('Готовы получить расчёт') || txt.includes('Позвонить') && txt.includes('WhatsApp') && i > 5) label = 'FinalCTA-candidate'
        return { i, label, id: s.id || null }
      })
      const deliveryIdx = sigs.findIndex((s) => s.label === 'Delivery')
      const calcIdx = sigs.findIndex((s) => s.label === 'DeliveryCalculator')
      return {
        sigs,
        deliveryBeforeCalc: deliveryIdx >= 0 && calcIdx > deliveryIdx,
        calcExists: calcIdx >= 0,
      }
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-desktop-order.json`),
      JSON.stringify(orderAudit, null, 2)
    )

    // 3. Focused calculator screenshot + interaction test
    await focusCalculator(page)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-default.png`),
      fullPage: false,
    })

    // Read default summary
    const defaults = await page.evaluate(() => document.body.innerText)
    const defaultPriceMatch = defaults.match(/(\d[\d\s]* ₽|\d[\d\s]*\s?₽)/g)?.slice(0, 5) || []

    // Change city → SPb
    await page.selectOption('select >> nth=0', { value: 'spb' })
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-spb.png`),
      fullPage: false,
    })

    // Change carrier → CDEK (last button)
    const carrierButtons = page.locator('button[type="button"]').filter({ hasText: /^(Деловые Линии|ПЭК|СДЭК)$/ })
    const cdekBtn = carrierButtons.filter({ hasText: 'СДЭК' })
    if (await cdekBtn.count()) {
      await cdekBtn.first().click()
      await page.waitForTimeout(400)
    }
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-cdek.png`),
      fullPage: false,
    })

    const cdekText = await page.evaluate(() => document.body.innerText)
    const cdekWarningPresent = cdekText.includes('СДЭК нужна ручная проверка') || cdekText.includes('негабаритным')

    // Click "+" to bump quantity
    const plusBtn = page.locator('button[aria-label="Увеличить количество"]').first()
    await plusBtn.click()
    await plusBtn.click()
    await page.waitForTimeout(400)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-qty4.png`),
      fullPage: false,
    })

    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-desktop-calc-interactions.json`),
      JSON.stringify({ defaultPriceMatch, cdekWarningPresent }, null, 2)
    )

    // 4. Standalone page still works
    const standalone = await page.goto(`${BASE_URL}delivery-calculator`, { waitUntil: 'networkidle', timeout: 30_000 })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-desktop-standalone.json`),
      JSON.stringify({ status: standalone?.status() }, null, 2)
    )
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-desktop-standalone.png`),
      fullPage: false,
    })

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

    await focusCalculator(page)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-calc.png`),
      fullPage: false,
    })

    // Horizontal overflow check at calculator
    const overflowAudit = await page.evaluate(() => {
      const html = document.documentElement
      return {
        documentScrollWidth: html.scrollWidth,
        viewportWidth: window.innerWidth,
        hasHOverflow: html.scrollWidth > window.innerWidth + 1,
      }
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-overflow.json`),
      JSON.stringify(overflowAudit, null, 2)
    )

    // Tap targets in calculator section
    const tapAudit = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2'))
      const calcH = headings.find((h) => (h.textContent || '').includes('Калькулятор доставки')) as HTMLElement | undefined
      if (!calcH) return null
      const section = calcH.closest('section') as HTMLElement | null
      if (!section) return null
      const targets = Array.from(section.querySelectorAll('button, a, select, input')) as HTMLElement[]
      const small: string[] = []
      targets.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width > 0 && r.height > 0 && (r.width < 44 || r.height < 44)) {
          small.push(`<${el.tagName.toLowerCase()}> ${Math.round(r.width)}×${Math.round(r.height)} text="${(el.textContent || '').trim().slice(0, 30)}"`)
        }
      })
      return { totalTargets: targets.length, smallTargets: small }
    })
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-tap-targets.json`),
      JSON.stringify(tapAudit, null, 2)
    )

    // Interaction on mobile: change city
    const citySelect = page.locator('select').first()
    if (await citySelect.count()) {
      await citySelect.selectOption({ value: 'kazan' })
      await page.waitForTimeout(400)
    }
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-se-calc-kazan.png`),
      fullPage: false,
    })

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

    await focusCalculator(page)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${VERSION}-mobile-14pro-calc.png`),
      fullPage: false,
    })

    await context.close()
  })

  test.afterAll(async () => {
    fs.writeFileSync(
      path.join(SCREENSHOT_DIR, `${VERSION}-events.json`),
      JSON.stringify(events, null, 2)
    )
    if (events.pageErrors.length > 0) console.warn('PAGE ERRORS:', events.pageErrors)
    if (events.consoleErrors.length > 0) console.warn('CONSOLE ERRORS:', events.consoleErrors)
    if (events.failedResponses.length > 0) console.warn('FAILED RESPONSES:', events.failedResponses)
  })
})
