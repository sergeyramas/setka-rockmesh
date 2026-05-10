'use client'
import { useEffect, useState } from 'react'
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { copy } from '@/content/copy'
import { product } from '@/content/product'

export default function CompareSlider() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <section id="compare" className="py-20 bg-[#F5F5F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-4">
          {copy.compare.heading}
        </h2>
        <p className="text-[#6B6B6B] mb-10 max-w-xl">
          {copy.compare.subheading}
        </p>

        <div className="relative rounded-[16px] overflow-hidden shadow-xl max-w-3xl mx-auto">
          {mounted ? (
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={product.photos.compareKustar}
                  alt={copy.compare.labelLeft}
                  style={{ objectFit: 'cover' }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={product.photos.compareRockmesh}
                  alt={copy.compare.labelRight}
                  style={{ objectFit: 'cover' }}
                />
              }
              style={{ height: 480 }}
            />
          ) : (
            <div
              className="bg-[#F5F5F5]"
              style={{ height: 480 }}
              aria-hidden
            />
          )}
        </div>

        <p className="text-[#6B6B6B] text-sm mt-6 max-w-xl mx-auto text-center">
          {copy.compare.caption}
        </p>
      </div>
    </section>
  )
}
