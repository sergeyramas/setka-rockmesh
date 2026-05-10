import { test, expect, Page } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SCREENSHOT_DIR = path.resolve(__dirname, '..', 'screenshots')
const BASE_URL = process.env.V9_BASE_URL ?? 'http://localhost:3001/'
const VERSION = 'v9shell'
const VIEWPORTS = [1280, 1440, 1920, 2560] as const
const HEIGHT = 900

async function scrollAndShoot(page: Page, prefix: string) {
  await page.waitForTimeout(2500)
  for (const p of [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]) {
    const y = await page.evaluate((pct) => {
      const total = document.documentElement.scrollHeight
      const vh = window.innerHeight
      return Math.max(0, Math.floor((total - vh) * pct))
    }, p)
    await page.evaluate((targetY) => window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior }), y)
    await page.waitForTimeout(900)
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${prefix}-${Math.round(p * 100)}.png`),
      fullPage: false,
    })
  }
}

async function auditCentering(page: Page, viewportWidth: number, label: string) {
  const audit = await page.evaluate((vw) => {
    const sections = Array.from(document.querySelectorAll('section[id], section')) as HTMLElement[]
    return sections.map((s) => {
      const sRect = s.getBoundingClientRect()
      const direct = s.firstElementChild as HTMLElement | null
      const directRect = direct?.getBoundingClientRect()
      const cs = direct ? getComputedStyle(direct) : null
      const expectedLeft = direct && directRect ? Math.round((vw - directRect.width) / 2) : 0
      return {
        id: s.id || null,
        viewport: vw,
        section: { left: Math.round(sRect.left), width: Math.round(sRect.width) },
        firstChild: direct && directRect ? {
          left: Math.round(directRect.left),
          width: Math.round(directRect.width),
          maxWidth: cs?.maxWidth,
          marginLeft: cs?.marginLeft,
          marginRight: cs?.marginRight,
        } : null,
        expectedLeft,
        centeredWithinTolerance: directRect
          ? Math.abs(Math.round(directRect.left) - expectedLeft) <= 4
          : null,
      }
    })
  }, viewportWidth)
  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, `${VERSION}-${label}-audit.json`),
    JSON.stringify(audit, null, 2)
  )
  return audit
}

for (const vw of VIEWPORTS) {
  test(`Viewport ${vw}px — sections centered`, async ({ browser }) => {
    const ctx = await browser.newContext({ viewport: { width: vw, height: HEIGHT }, deviceScaleFactor: 1 })
    const page = await ctx.newPage()
    const resp = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 })
    expect(resp?.status()).toBe(200)

    await scrollAndShoot(page, `${VERSION}-${vw}`)
    const audit = await auditCentering(page, vw, String(vw))

    // Skip Hero section — its sticky text-card is intentionally offset, not max-w-[1280px]
    // Skip header/footer — different shell rules
    const constrainedSections = audit.filter(
      (s) => s.firstChild && s.firstChild.maxWidth && s.firstChild.maxWidth.includes('px') && s.id !== 'hero'
    )
    const offCenter = constrainedSections.filter((s) => s.centeredWithinTolerance === false)
    if (offCenter.length > 0) {
      console.error(`Off-center sections at ${vw}px:`, offCenter.map((s) => s.id))
    }
    expect(offCenter, `Off-center sections on ${vw}px viewport`).toEqual([])

    await ctx.close()
  })
}
