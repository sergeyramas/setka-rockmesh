'use client'

import { useEffect, useRef } from 'react'
import { ScrollTrigger } from '@/lib/gsap'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

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

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const tooltipRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    const textEl = textRef.current
    if (!video || !section) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    if (reduceMotion || isMobile) {
      video.autoplay = true
      video.loop = true
      video.muted = true
      const playPromise = video.play()
      if (playPromise) playPromise.catch(() => {})

      tooltipRefs.current.forEach((el) => {
        if (el) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }
      })
      return
    }

    let scrollTrigger: ScrollTrigger | null = null
    let cancelled = false

    const setup = () => {
      if (cancelled || !video.duration) return
      video.pause()
      video.currentTime = 0

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress

          if (video.duration) {
            const target = p * video.duration
            if (Math.abs(video.currentTime - target) > 0.02) {
              video.currentTime = target
            }
          }

          if (textEl) {
            const fade = clamp01(p / 0.3)
            textEl.style.opacity = String(1 - fade)
            textEl.style.transform = `translateY(${-40 * fade}px)`
          }

          tooltipRefs.current.forEach((el, i) => {
            if (!el) return
            const at = TOOLTIPS[i].appearAt
            const op = clamp01((p - at) / 0.08)
            el.style.opacity = String(op)
            el.style.transform = `translateY(${(1 - op) * 10}px)`
          })
        },
      })
    }

    if (video.readyState >= 1) {
      setup()
    } else {
      video.addEventListener('loadedmetadata', setup, { once: true })
    }

    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', setup)
      scrollTrigger?.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '300vh' }}
      aria-label="ROCKMESH — стеклопластиковая сетка"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <video
          ref={videoRef}
          src="/video/rockmesh-hero.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 w-full h-full object-contain"
        />

        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent"
        />

        <div className="absolute inset-y-0 left-0 z-10 flex items-center pointer-events-none">
          <div
            ref={textRef}
            className="pl-4 sm:pl-8 md:pl-12 pr-4 max-w-lg pointer-events-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <span className="inline-flex items-center gap-2 text-[#00A86B] text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A86B] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00A86B]" />
              </span>
              В наличии — отгрузка сегодня
            </span>

            <h1 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(28px,4vw,56px)] leading-[1.05] text-white mb-4">
              Стеклопластиковая сетка
              <br />
              <span className="text-[#FF6B00]">{product.brand}</span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              {product.price} {product.priceUnit} · производство Гален · ISO 9001:2015
              <br />
              Доставка СДЭК по всей России
            </p>

            <div className="flex gap-3 sm:gap-4 flex-wrap">
              <a
                href={TEL_HREF}
                className="bg-[#FF6B00] text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:bg-[#FFB280] transition-colors"
              >
                {copy.cta.call}
              </a>
              <a
                href={product.contact.telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/30 text-white px-5 sm:px-6 py-3 rounded-lg font-semibold hover:border-white transition-colors"
              >
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
            className={`absolute z-20 pointer-events-none max-w-[200px] ${t.className}`}
            style={{ opacity: 0, transform: 'translateY(10px)', willChange: 'transform, opacity' }}
            aria-hidden
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 shadow-lg">
              <div className="text-[#FF6B00] font-semibold text-sm mb-0.5">{t.label}</div>
              <div className="text-white/80 text-xs leading-snug">{t.detail}</div>
            </div>
            <div className="absolute w-px h-8 bg-white/30 left-1/2 -bottom-8" />
          </div>
        ))}

        <div
          aria-hidden
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs uppercase tracking-widest"
        >
          ↓ Прокрутите, чтобы увидеть состав
        </div>
      </div>
    </section>
  )
}
