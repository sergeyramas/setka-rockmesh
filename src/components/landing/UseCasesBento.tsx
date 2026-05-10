import Image from 'next/image'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function UseCasesBento() {
  return (
    <section id="usecases" className="py-20 bg-[#F5F5F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-12">
          {copy.useCases.heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {product.useCases.map((uc) => (
            <div
              key={uc.key}
              className="relative group rounded-[16px] overflow-hidden aspect-[4/3] bg-white border border-black/5 shadow-sm"
            >
              <Image
                src={uc.image}
                alt={uc.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05] motion-reduce:transform-none"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-[family-name:var(--font-family-display)] font-bold text-white text-lg">
                  {uc.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
