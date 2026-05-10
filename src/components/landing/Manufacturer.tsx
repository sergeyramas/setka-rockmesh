import Image from 'next/image'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function Manufacturer() {
  return (
    <section id="manufacturer" className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center">
          {/* Left: lab photo + text */}
          <div className="max-w-[640px]">
            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-6">
              {copy.manufacturer.heading}
            </h2>
            <p className="text-base sm:text-lg text-[#3a3a3a] leading-relaxed mb-4">{copy.manufacturer.body}</p>
            <p className="text-base sm:text-lg text-[#3a3a3a] leading-relaxed mb-8">{copy.manufacturer.body2}</p>
            <div className="text-sm text-[#6B6B6B]">
              <span className="text-[#0F0F0F] font-semibold">{copy.manufacturer.ogrnLabel}: </span>
              <span className="font-[family-name:var(--font-family-mono)]">
                {product.manufacturer.ogrnNumber}
              </span>
            </div>
          </div>

          {/* Right: lab photo */}
          <div className="relative aspect-[5/4] rounded-[16px] overflow-hidden">
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

        {/* Production note — replaces "Objects with ROCKMESH" placeholders.
            Real client-object photos pending; ship the truthful version meanwhile. */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 items-center">
          <div>
            <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-[#0F0F0F] mb-3">
              География производства
            </h3>
            <p className="text-[#3a3a3a] leading-relaxed">
              Сетка ROCKMESH идёт на стройки и инфраструктуру по всей России и в десятки стран мира. Список объектов и фото с площадок уточняются у клиента — будут опубликованы по мере получения подтверждений.
            </p>
          </div>
          <div className="relative aspect-[16/9] rounded-[16px] overflow-hidden">
            <Image
              src="/codex/galen-factory.png"
              alt="Производственная линия ROCKMESH на заводе «Гален»"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-[8px]">
              Производственная линия, г. Чебоксары
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
