import Image from 'next/image'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function Composition() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-4">
          {copy.composition.heading}
        </h2>
        <p className="text-[#6B6B6B] mb-12 max-w-xl">
          {copy.composition.subheading}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {product.composition.map((layer, i) => (
            <div key={layer.key} className="flex flex-col gap-4">
              <div className="aspect-square bg-[#F5F5F5] rounded-[16px] overflow-hidden relative">
                <Image
                  src={layer.image}
                  alt={layer.label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3 w-7 h-7 bg-[#FF6B00] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {i + 1}
                </div>
              </div>
              <div>
                <p className="font-[family-name:var(--font-family-display)] font-bold text-[#0F0F0F] text-sm">
                  {layer.label}
                </p>
                <p className="text-[#6B6B6B] text-xs mt-1 leading-relaxed">{layer.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
