'use client'
import { useEffect, useRef } from 'react'
import { copy } from '@/content/copy'
import { product } from '@/content/product'

// Linear projection of European Russia + Urals into the SVG viewBox.
// viewBox: 0..1000 × 0..600
//   x = (lon - 18) * 22
//   y = (70 - lat) * 22
const project = (lon: number, lat: number) => ({
  x: (lon - 18) * 22,
  y: (70 - lat) * 22,
})

type City = {
  name: string
  lon: number
  lat: number
  labelOffset?: { dx: number; dy: number }
}

const ORIGIN: City = { name: 'Чебоксары', lon: 47.25, lat: 56.13 }

const CITIES: City[] = [
  { name: 'Москва', lon: 37.6, lat: 55.75, labelOffset: { dx: -10, dy: -14 } },
  { name: 'Санкт-Петербург', lon: 30.3, lat: 59.93, labelOffset: { dx: -10, dy: -14 } },
  { name: 'Нижний Новгород', lon: 44.0, lat: 56.32, labelOffset: { dx: -10, dy: -14 } },
  { name: 'Казань', lon: 49.1, lat: 55.79, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Самара', lon: 50.1, lat: 53.2, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Уфа', lon: 56.0, lat: 54.7, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Пермь', lon: 56.2, lat: 58.0, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Екатеринбург', lon: 60.6, lat: 56.83, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Челябинск', lon: 61.4, lat: 55.16, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Волгоград', lon: 44.5, lat: 48.7, labelOffset: { dx: 14, dy: 4 } },
  { name: 'Ростов-на-Дону', lon: 39.7, lat: 47.23, labelOffset: { dx: -10, dy: -14 } },
  { name: 'Краснодар', lon: 38.97, lat: 45.04, labelOffset: { dx: -10, dy: -14 } },
  { name: 'Воронеж', lon: 39.2, lat: 51.66, labelOffset: { dx: -10, dy: -14 } },
]

// Simplified outline of European Russia + Urals as lon/lat polygon.
const RUSSIA_PATH = (() => {
  const pts: [number, number][] = [
    [28, 70], [33, 69], [40, 67.5], [50, 67.5], [60, 67.5], [68, 65],
    [72, 60], [70, 56], [68, 52], [62, 51], [56, 51], [54, 50], [50, 51],
    [48, 50], [50, 47.5], [49, 45], [47, 44], [45, 43], [42, 43.5],
    [39, 44], [38, 47], [36, 48], [33, 49.5], [30, 51], [28, 53], [27, 56],
    [27, 60], [26, 64], [27, 67],
  ]
  return pts
    .map(([lon, lat], i) => {
      const { x, y } = project(lon, lat)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ') + ' Z'
})()

export default function Delivery() {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef = useRef<SVGGElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const lines = linesRef.current
    if (!section || !lines) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const paths = lines.querySelectorAll('path[data-route]')
            paths.forEach((p, i) => {
              const el = p as SVGPathElement
              const len = el.getTotalLength()
              el.style.strokeDasharray = `${len}`
              el.style.strokeDashoffset = reduceMotion ? '0' : `${len}`
              if (!reduceMotion) {
                el.animate(
                  [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
                  {
                    duration: 1100,
                    delay: i * 90,
                    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
                    fill: 'forwards',
                  }
                )
              }
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.25 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const origin = project(ORIGIN.lon, ORIGIN.lat)

  return (
    <section ref={sectionRef} id="delivery" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
          <div>
            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,3.5vw,42px)] leading-[1.08] text-balance text-[#0F0F0F] mb-6">
              {copy.delivery.heading}
            </h2>
            <p className="text-base text-[#3a3a3a] leading-relaxed mb-6">{copy.delivery.body}</p>

            <div className="rounded-2xl bg-[#F5F5F5] p-5 mb-6">
              <div className="text-xs text-[#6B6B6B] uppercase tracking-widest font-semibold mb-1">
                {copy.delivery.warehouseLabel}
              </div>
              <div className="text-2xl font-[family-name:var(--font-family-display)] font-extrabold text-[#0F0F0F]">
                {copy.delivery.warehouseCity}
              </div>
              <div className="text-sm text-[#6B6B6B] mt-1">{copy.delivery.selfPickup}</div>
            </div>

            <div className="text-sm font-semibold text-[#0F0F0F] mb-3">
              {copy.delivery.carriersLabel}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.carriers.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F5F5F5] text-sm text-[#0F0F0F] font-semibold border border-black/5"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 1000 600"
              className="w-full h-auto"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Карта доставки по России: Чебоксары — Москва, Санкт-Петербург, Казань, Нижний Новгород и другие города-миллионники"
            >
              <defs>
                <linearGradient id="land" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5F5F5" />
                  <stop offset="100%" stopColor="#EAEAEA" />
                </linearGradient>
                <radialGradient id="origin-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity="0" />
                </radialGradient>
              </defs>

              <path
                d={RUSSIA_PATH}
                fill="url(#land)"
                stroke="#D1D5DB"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              <g ref={linesRef} fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 5">
                {CITIES.map((c) => {
                  const p = project(c.lon, c.lat)
                  return (
                    <path
                      key={c.name}
                      data-route
                      d={`M ${origin.x} ${origin.y} L ${p.x} ${p.y}`}
                    />
                  )
                })}
              </g>

              {CITIES.map((c) => {
                const p = project(c.lon, c.lat)
                const lo = c.labelOffset ?? { dx: 12, dy: 4 }
                return (
                  <g key={c.name}>
                    <circle cx={p.x} cy={p.y} r="6" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="2.5" />
                    <text
                      x={p.x + lo.dx}
                      y={p.y + lo.dy}
                      fontSize="14"
                      fontWeight="600"
                      fill="#0F0F0F"
                      style={{ paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: 4, strokeLinejoin: 'round' }}
                    >
                      {c.name}
                    </text>
                  </g>
                )
              })}

              <circle cx={origin.x} cy={origin.y} r="32" fill="url(#origin-glow)" />
              <circle cx={origin.x} cy={origin.y} r="11" fill="#FF6B00" stroke="#FFFFFF" strokeWidth="3" />
              <text
                x={origin.x + 16}
                y={origin.y + 6}
                fontSize="18"
                fontWeight="800"
                fill="#FF6B00"
                style={{ paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: 4, strokeLinejoin: 'round' }}
              >
                Чебоксары
              </text>
              <text
                x={origin.x + 16}
                y={origin.y + 22}
                fontSize="11"
                fontWeight="600"
                fill="#6B6B6B"
                style={{ paintOrder: 'stroke', stroke: '#FFFFFF', strokeWidth: 4, strokeLinejoin: 'round' }}
              >
                Склад отгрузки
              </text>
            </svg>
            <p className="mt-4 text-sm text-[#6B6B6B] text-center">
              Отгрузка в 13 городов-миллионников и любой пункт выдачи СДЭК / Деловых Линий по всей России.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
