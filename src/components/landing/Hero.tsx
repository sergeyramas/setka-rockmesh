'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from '@/lib/motion'
import { product } from '@/content/product'
import { copy } from '@/content/copy'
import MagneticButton from '@/components/global/ui/MagneticButton'
import PulsingDot from '@/components/global/ui/PulsingDot'

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0F0F0F]"
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <Image
          src={product.photos.main}
          alt="Сетка стеклопластиковая ROCKMESH"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#0F0F0F]/80 to-transparent" />
      </motion.div>

      {/* Wow-video slot — will be replaced post-launch */}
      <div
        data-wow-video-slot
        className="absolute right-0 top-0 w-1/2 h-full hidden lg:block"
        aria-hidden="true"
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-8 py-24"
        style={{ opacity }}
      >
        <div className="flex items-center gap-2 mb-6">
          <PulsingDot />
          <span className="text-[#00A86B] text-sm font-semibold uppercase tracking-wider">
            {copy.product.inStock}
          </span>
        </div>
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(32px,5vw,64px)] leading-[1.1] text-white max-w-2xl mb-6">
          {copy.hero.h1}
        </h2>
        <p className="text-[#6B6B6B] text-lg max-w-xl mb-10 leading-relaxed">
          {copy.hero.h2}
        </p>
        <div className="flex flex-wrap gap-4">
          <MagneticButton href={`tel:${product.contact.phone}`} variant="primary">
            📞 {copy.cta.call}
          </MagneticButton>
          <MagneticButton href={product.contact.telegramLink} variant="ghost">
            💬 {copy.cta.telegram}
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  )
}
