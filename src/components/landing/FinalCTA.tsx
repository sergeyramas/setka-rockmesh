import { copy } from '@/content/copy'
import { product } from '@/content/product'
import MagneticButton from '@/components/global/ui/MagneticButton'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#1A1A1A] grain-overlay text-center">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(28px,5vw,56px)] text-white mb-6">
          {copy.finalCta.heading}
        </h2>
        <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto mb-12">
          {copy.finalCta.body}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <MagneticButton href={`tel:${product.contact.phone}`} variant="primary">
            📞 {copy.finalCta.call}
          </MagneticButton>
          <MagneticButton href={product.contact.whatsappLink} variant="secondary">
            💬 {copy.finalCta.whatsapp}
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
