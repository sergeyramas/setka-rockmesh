import { copy } from '@/content/copy'
import { product } from '@/content/product'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-[#F5F5F5] text-center">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(28px,5vw,56px)] text-[#0F0F0F] mb-6">
          {copy.finalCta.heading}
        </h2>
        <p className="text-[#6B6B6B] text-lg max-w-xl mx-auto mb-12">
          {copy.finalCta.body}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href={`tel:${product.contact.phone.replace(/[^+\d]/g, '')}`}
            className="inline-flex items-center gap-2 min-h-12 bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white font-bold px-7 py-3.5 rounded-lg shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_8px_24px_rgba(255,107,0,0.4)] hover:-translate-y-px transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
            </svg>
            {copy.finalCta.call}
          </a>
          <a
            href={product.contact.telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 min-h-12 bg-white border border-black/10 text-[#0F0F0F] font-bold px-7 py-3.5 rounded-lg hover:border-[#229ED9] hover:text-[#229ED9] transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
            </svg>
            {copy.finalCta.telegram}
          </a>
        </div>
      </div>
    </section>
  )
}
