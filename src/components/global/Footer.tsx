import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/10 py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-[family-name:var(--font-family-display)] font-extrabold text-xl text-[#FF6B00] mb-2">
              ROCKMESH
            </p>
            <p className="text-[#6B6B6B] text-sm">{copy.footer.company}</p>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-white font-semibold text-sm mb-3">Контакты</p>
            <p className="text-[#6B6B6B] text-sm mb-1">
              <a href={`tel:${product.contact.phone}`} className="hover:text-[#FF6B00] transition-colors">
                {product.contact.phoneDisplay}
              </a>
            </p>
            <p className="text-[#6B6B6B] text-sm mb-1">
              <a href={`mailto:${product.manufacturer.email}`} className="hover:text-[#FF6B00] transition-colors">
                {product.manufacturer.email}
              </a>
            </p>
          </div>

          {/* Rekvizity */}
          <div>
            <p className="text-white font-semibold text-sm mb-3">Реквизиты</p>
            <p className="text-[#6B6B6B] text-sm mb-1">{copy.footer.address}</p>
            <p className="text-[#6B6B6B] text-sm">
              <span className="text-white">{copy.footer.ogrnLabel}: </span>
              <span className="font-[family-name:var(--font-family-mono)]">{product.manufacturer.ogrnNumber}</span>
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between gap-4">
          <p className="text-[#6B6B6B] text-xs">{copy.footer.disclaimer}</p>
          <p className="text-[#6B6B6B] text-xs">{copy.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
