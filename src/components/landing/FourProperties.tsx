'use client'
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { useReducedMotion } from '@/lib/motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { copy } from '@/content/copy'

const iconMap: Record<string, string> = {
  alkali: '/icons/alkali.svg',
  adhesion: '/icons/adhesion.svg',
  precision: '/icons/precision.svg',
  certified: '/icons/certified.svg',
}

export default function FourProperties() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce || !containerRef.current) return

    const cards = containerRef.current.querySelectorAll('[data-property-card]')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      }
    )

    // SVG stroke animation
    const paths = containerRef.current.querySelectorAll('.svg-path-animated')
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      onEnter: () => paths.forEach((p) => p.classList.add('is-visible')),
    })

    return () => ScrollTrigger.getAll().forEach((t) => t.kill())
  }, [shouldReduce])

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {copy.properties.map((prop) => (
            <div
              key={prop.key}
              data-property-card
              className="bg-white border border-black/5 shadow-sm rounded-[16px] p-6 flex flex-col gap-4"
            >
              <div className="w-12 h-12 text-[#FF6B00]">
                <Image
                  src={iconMap[prop.key]}
                  alt=""
                  width={48}
                  height={48}
                  className="text-accent"
                  style={{ filter: 'invert(52%) sepia(97%) saturate(1200%) hue-rotate(360deg)' }}
                />
              </div>
              <h3 className="font-[family-name:var(--font-family-display)] font-bold text-lg text-[#0F0F0F]">
                {prop.title}
              </h3>
              <p className="text-[#6B6B6B] text-sm leading-relaxed">{prop.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
