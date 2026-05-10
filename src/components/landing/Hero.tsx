'use client'

import { useEffect, useRef, useState } from 'react'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

const FRAME_COUNT = 241

type TooltipSpec = {
  label: string
  detail: string
  className: string
  appearAt: number
}

const TOOLTIPS: TooltipSpec[] = [
  {
    label: 'Эпоксидная смола',
    detail: 'Связующее: аминный отвердитель',
    className: 'top-[15%] left-[38%]',
    appearAt: 0.35,
  },
  {
    label: 'Стеклянные нити',
    detail: 'Высокомодульный ровинг',
    className: 'top-[10%] right-[15%]',
    appearAt: 0.45,
  },
  {
    label: 'Кварцевый песок',
    detail: 'Покрытие для адгезии в бетоне',
    className: 'bottom-[15%] left-[30%]',
    appearAt: 0.55,
  },
  {
    label: 'Узел вязки',
    detail: 'Полимерный фиксатор',
    className: 'top-[45%] right-[10%]',
    appearAt: 0.65,
  },
]

const TEL_HREF = `tel:${product.contact.phone.replace(/[^+\d]/g, '')}`

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v))
}

function frameUrl(i: number) {
  return `/frames/frame_${String(i).padStart(3, '0')}.jpg`
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const tooltipRefs = useRef<Array<HTMLDivElement | null>>([])
  const imagesRef = useRef<HTMLImageElement[]>([])
  const lastFrameRef = useRef<number>(-1)
  const rafRef = useRef<number | null>(null)
  const [loadedCount, setLoadedCount] = useState(0)

  // 1. Preload all frames in parallel
  useEffect(() => {
    const images: HTMLImageElement[] = []
    let cancelled = false

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => {
        if (cancelled) return
        setLoadedCount((c) => c + 1)
      }
      images.push(img)
    }
    imagesRef.current = images

    return () => {
      cancelled = true
    }
  }, [])

  // 2. Canvas size + draw on scroll
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const textEl = textRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    function fitCanvas() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas!.getBoundingClientRect()
      canvas!.width = Math.round(rect.width * dpr)
      canvas!.height = Math.round(rect.height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function drawFrame(idx: number) {
      const img = imagesRef.current[idx]
      if (!img || !img.complete || img.naturalWidth === 0) return
      const cssW = canvas!.clientWidth
      const cssH = canvas!.clientHeight
      ctx!.fillStyle = '#ffffff'
      ctx!.fillRect(0, 0, cssW, cssH)

      // object-contain math
      const ar = img.naturalWidth / img.naturalHeight
      const canvasAr = cssW / cssH
      let drawW = cssW
      let drawH = cssH
      if (ar > canvasAr) {
        drawH = cssW / ar
      } else {
        drawW = cssH * ar
      }
      const dx = (cssW - drawW) / 2
      const dy = (cssH - drawH) / 2
      ctx!.drawImage(img, dx, dy, drawW, drawH)
    }

    function pickFrame(progress: number) {
      const i = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(progress * (FRAME_COUNT - 1))))
      // Walk back to nearest already-loaded frame so partial loading still shows something
      for (let k = i; k >= 0; k--) {
        const img = imagesRef.current[k]
        if (img && img.complete && img.naturalWidth > 0) return k
      }
      return 0
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    fitCanvas()

    function update() {
      rafRef.current = null
      if (!section) return
      const rect = section.getBoundingClientRect()
      const total = section.offsetHeight - window.innerHeight
      const progress = clamp01(-rect.top / Math.max(1, total))

      const target = pickFrame(progress)
      if (target !== lastFrameRef.current) {
        drawFrame(target)
        lastFrameRef.current = target
      }

      if (textEl && !isMobile) {
        const fade = clamp01(progress / 0.3)
        textEl.style.opacity = String(1 - fade)
        textEl.style.transform = `translateY(${-40 * fade}px)`
      }

      tooltipRefs.current.forEach((el, i) => {
        if (!el || isMobile) return
        const at = TOOLTIPS[i].appearAt
        const op = clamp01((progress - at) / 0.08)
        el.style.opacity = String(op)
        el.style.transform = `translateY(${(1 - op) * 10}px)`
      })
    }

    function schedule() {
      if (rafRef.current != null) return
      rafRef.current = requestAnimationFrame(update)
    }

    function onResize() {
      fitCanvas()
      lastFrameRef.current = -1
      schedule()
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)

    // Mobile / reduced-motion: simple looping animation with setInterval
    let interval: ReturnType<typeof setInterval> | null = null
    if (reduceMotion || isMobile) {
      let i = 0
      interval = setInterval(() => {
        i = (i + 1) % FRAME_COUNT
        drawFrame(i)
        lastFrameRef.current = i
      }, 60)
    } else {
      schedule()
    }

    // Initial draw — paint frame 0 as soon as it arrives
    const first = imagesRef.current[0]
    if (first) {
      if (first.complete && first.naturalWidth > 0) {
        drawFrame(0)
        lastFrameRef.current = 0
      } else {
        first.addEventListener('load', () => {
          drawFrame(0)
          lastFrameRef.current = 0
        }, { once: true })
      }
    }

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', onResize)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
      if (interval) clearInterval(interval)
    }
  }, [])

  // Trigger initial draw once frames start loading
  useEffect(() => {
    if (loadedCount > 0 && lastFrameRef.current === -1 && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d', { alpha: false })
      const img = imagesRef.current[0]
      if (ctx && img && img.complete && img.naturalWidth > 0) {
        const cssW = canvasRef.current.clientWidth
        const cssH = canvasRef.current.clientHeight
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, cssW, cssH)
        const ar = img.naturalWidth / img.naturalHeight
        const canvasAr = cssW / cssH
        let drawW = cssW, drawH = cssH
        if (ar > canvasAr) drawH = cssW / ar
        else drawW = cssH * ar
        ctx.drawImage(img, (cssW - drawW) / 2, (cssH - drawH) / 2, drawW, drawH)
        lastFrameRef.current = 0
      }
    }
  }, [loadedCount])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-white"
      style={{ height: '300vh' }}
      aria-label="ROCKMESH — стеклопластиковая сетка"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          aria-hidden
        />

        <div className="absolute inset-y-0 left-0 z-10 flex items-center pointer-events-none">
          <div
            ref={textRef}
            className="ml-4 sm:ml-8 md:ml-12 mr-4 max-w-lg pointer-events-auto bg-white/85 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="inline-flex items-center gap-2 text-[#00A86B] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A86B] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00A86B]" />
              </span>
              В наличии — отгрузка сегодня
            </span>

            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(28px,4vw,56px)] leading-[1.05] text-balance text-[#0F0F0F] mb-4">
              {copy.hero.h1}
            </h2>

            <p className="text-[#3a3a3a] text-base sm:text-lg mb-3 leading-relaxed">
              {copy.hero.h2}
            </p>

            <p className="text-[#6B6B6B] text-sm mb-8 leading-relaxed">
              <span className="text-[#FF6B00] font-semibold">{product.brand}</span> · {product.price} {product.priceUnit} · производство Гален · ISO 9001:2015 · Доставка СДЭК
            </p>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <a
                href={TEL_HREF}
                className="inline-flex items-center gap-2 min-h-11 bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white px-5 sm:px-6 py-3 rounded-lg font-semibold shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_8px_24px_rgba(255,107,0,0.35)] hover:-translate-y-px transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
                {copy.cta.call}
              </a>
              <a
                href={product.contact.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 min-h-11 border border-black/15 bg-white text-[#0F0F0F] px-5 sm:px-6 py-3 rounded-lg font-semibold hover:border-[#229ED9] hover:text-[#229ED9] transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
                </svg>
                {copy.cta.telegram}
              </a>
            </div>
          </div>
        </div>

        {TOOLTIPS.map((t, i) => (
          <div
            key={t.label}
            ref={(el) => {
              tooltipRefs.current[i] = el
            }}
            className={`absolute z-20 pointer-events-none max-w-[200px] hidden md:block ${t.className}`}
            style={{ opacity: 0, transform: 'translateY(10px)', willChange: 'transform, opacity' }}
            aria-hidden
          >
            <div className="bg-white border border-black/10 rounded-xl px-4 py-3 shadow-md">
              <div className="text-[#FF6B00] font-semibold text-sm mb-0.5">{t.label}</div>
              <div className="text-[#6B6B6B] text-xs leading-snug">{t.detail}</div>
            </div>
            <div className="absolute w-px h-8 bg-black/20 left-1/2 -bottom-8" />
          </div>
        ))}

        <div
          aria-hidden
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-[#9a9a9a] text-xs uppercase tracking-widest"
        >
          ↓ Прокрутите, чтобы увидеть состав
        </div>
      </div>
    </section>
  )
}
