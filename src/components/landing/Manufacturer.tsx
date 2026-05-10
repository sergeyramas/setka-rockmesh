import Image from 'next/image'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function Manufacturer() {
  return (
    <section id="manufacturer" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: lab photo + text */}
          <div>
            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-6">
              {copy.manufacturer.heading}
            </h2>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">{copy.manufacturer.body}</p>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">{copy.manufacturer.body2}</p>
            <div className="text-sm text-[#6B6B6B]">
              <span className="text-[#0F0F0F] font-semibold">{copy.manufacturer.ogrnLabel}: </span>
              <span className="font-[family-name:var(--font-family-mono)]">
                {product.manufacturer.ogrnNumber}
              </span>
            </div>
          </div>

          {/* Right: lab photo */}
          <div className="relative aspect-[4/3] rounded-[16px] overflow-hidden">
            <Image
              src={product.photos.lab}
              alt="Лаборатория контроля качества Гален"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-[8px]">
              Лаборатория контроля качества, г. Чебоксары
            </div>
          </div>
        </div>

        {/* Objects */}
        <div className="mt-16">
          <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-[#0F0F0F] mb-8">
            {copy.manufacturer.objectsHeading}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {product.objects.map((obj) => (
              <div
                key={obj.name}
                className="bg-white border border-black/5 shadow-sm rounded-[16px] overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src={obj.image}
                    alt={obj.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#0F0F0F] text-sm">{obj.name}</p>
                  <p className="text-[#6B6B6B] text-xs mt-1">{obj.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
