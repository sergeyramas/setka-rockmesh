'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion } from '@/lib/motion'
import Lightbox from '@/components/global/ui/Lightbox'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function Certificates() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-4">
          {copy.certificates.heading}
        </h2>
        <p className="text-[#6B6B6B] mb-12">{copy.certificates.body}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl">
          {product.certificates.map((cert) => (
            <motion.div
              key={cert.name}
              layoutId={`cert-${cert.image}`}
              className="bg-white border border-black/5 shadow-sm rounded-[16px] overflow-hidden cursor-zoom-in"
              onClick={() => setOpen(cert.image)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {/* Glass overlay — no date visible */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-bold text-sm">{cert.name}</p>
                  <p className="text-[#6B6B6B] text-xs mt-1">{cert.issuer}</p>
                </div>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span className="text-[#FF6B00] text-xs font-semibold uppercase tracking-wider">
                  {copy.certificates.clickHint}
                </span>
                <span className="text-[#6B6B6B] text-xs">🔍</span>
              </div>
            </motion.div>
          ))}
        </div>

        <p className="text-[#6B6B6B] text-xs mt-6">{copy.certificates.disclaimer}</p>
      </div>

      {open && (
        <Lightbox
          src={open}
          alt="Сертификат"
          isOpen={!!open}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  )
}
