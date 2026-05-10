'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/motion'
import { ScrollTrigger } from '@/lib/gsap'
import { copy } from '@/content/copy'
import { product } from '@/content/product'

export default function Delivery() {
  const mapRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce || !mapRef.current) return

    const paths = mapRef.current.querySelectorAll('.svg-path-animated')
    ScrollTrigger.create({
      trigger: mapRef.current,
      start: 'top 70%',
      onEnter: () => paths.forEach((p) => p.classList.add('is-visible')),
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [shouldReduce])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-6">
              {copy.delivery.heading}
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">{copy.delivery.body}</p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">{copy.delivery.selfPickup}</p>
            <div className="mb-4">
              <span className="text-[#6B6B6B] text-sm">{copy.delivery.carriersLabel} </span>
              <span className="font-semibold text-[#0F0F0F]">{product.carriers.join(', ')}</span>
            </div>
            <div className="flex items-center gap-3 bg-[#F5F5F5] rounded-[12px] p-4">
              <span className="text-[#FF6B00] text-2xl">📦</span>
              <div>
                <p className="text-[#0F0F0F] font-semibold text-sm">{copy.delivery.warehouseLabel}</p>
                <p className="text-[#6B6B6B] text-xs">{copy.delivery.warehouseCity} — центр европейской России</p>
              </div>
            </div>
          </div>

          {/* SVG schematic map */}
          <div ref={mapRef} className="bg-[#F5F5F5] rounded-[24px] p-8">
            <Image
              src="/icons/russia-schematic.svg"
              alt="Схема доставки из Чебоксар"
              width={400}
              height={280}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
