'use client'
import { useRef, useEffect } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { copy } from '@/content/copy'

export default function TechSpecs() {
  const tableRef = useRef<HTMLTableElement>(null)
  const priceRef = useRef<HTMLSpanElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (!priceRef.current) return

    if (shouldReduce) {
      priceRef.current.textContent = '150 ₽/м²'
      return
    }

    const obj = { val: 0 }
    ScrollTrigger.create({
      trigger: priceRef.current,
      start: 'top 80%',
      onEnter: () => {
        gsap.to(obj, {
          val: 150,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            if (priceRef.current) priceRef.current.textContent = `${Math.round(obj.val)} ₽/м²`
          },
        })
      },
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [shouldReduce])

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-12">
          {copy.specs.heading}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Count-up highlight — intentionally dark card on white page */}
          <div className="bg-[#0F0F0F] text-white rounded-[24px] p-10 flex flex-col gap-3">
            <span className="text-[#9a9a9a] text-sm uppercase tracking-widest">Цена</span>
            <span
              ref={priceRef}
              className="font-[family-name:var(--font-family-mono)] font-semibold text-[clamp(48px,8vw,80px)] text-[#FF6B00]"
            >
              0 ₽/м²
            </span>
            <span className="text-[#9a9a9a] text-sm">от производителя, без посредников</span>
          </div>

          {/* Specs table */}
          <table ref={tableRef} className="w-full text-sm">
            <tbody>
              {copy.specs.rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`border-b border-black/10 ${i % 2 === 0 ? 'bg-[#F5F5F5]/50' : ''}`}
                >
                  <td className="py-3 px-4 text-[#6B6B6B]">{row.label}</td>
                  <td className="py-3 px-4 text-right font-[family-name:var(--font-family-mono)] font-semibold text-[#0F0F0F]">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
