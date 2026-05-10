'use client'
import { product } from '@/content/product'

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} из 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`w-3.5 h-3.5 ${i < count ? 'text-[#FF6B00]' : 'text-black/15'}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1l2.93 5.94 6.55.95-4.74 4.62 1.12 6.52L10 16.94l-5.86 3.09 1.12-6.52L.52 7.89l6.55-.95L10 1z" />
        </svg>
      ))}
    </div>
  )
}

function Initials({ name }: { name: string }) {
  const parts = name.replace(/[^\p{L}\s.]/gu, '').split(/\s+/).filter(Boolean)
  const a = parts[0]?.[0] ?? '?'
  const b = parts[1]?.[0] ?? ''
  return (
    <div className="shrink-0 w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] font-bold text-sm flex items-center justify-center">
      {a}
      {b}
    </div>
  )
}

function ReviewCard({ r }: { r: typeof product.reviews[number] }) {
  return (
    <article className="shrink-0 w-[320px] sm:w-[360px] mx-3 bg-white border border-black/5 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Initials name={r.name} />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[#0F0F0F] text-sm truncate">{r.name}</div>
          <div className="text-xs text-[#6B6B6B]">{r.city} · {r.date}</div>
          <div className="mt-1.5">
            <Stars count={r.rating} />
          </div>
        </div>
      </div>
      <p className="text-sm text-[#475569] leading-relaxed line-clamp-6">«{r.text}»</p>
      <a
        href={r.sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-xs text-[#6B6B6B] hover:text-[#FF6B00] inline-flex items-center gap-1 mt-auto"
      >
        Источник: {r.sourceLabel}
        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 17 17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </a>
    </article>
  )
}

export default function RealReviews() {
  // Duplicate the list for a seamless infinite loop
  const loop = [...product.reviews, ...product.reviews]

  return (
    <section id="reviews" className="py-20 bg-[#F5F5F5] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 mb-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-family-display)] font-extrabold text-[clamp(24px,4vw,48px)] text-[#0F0F0F] mb-3">
              Что говорят о стеклопластиковой сетке в&nbsp;интернете
            </h2>
            <p className="text-[#6B6B6B] max-w-2xl">
              Это публичные отзывы с открытых ресурсов — форумов строителей и страниц производителей.
              Свои отзывы по этой партии собираем — пока приведено мнение третьих лиц о продукте.
            </p>
          </div>

          <a
            href={product.seller.avitoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white border border-black/10 rounded-xl px-5 py-3 hover:border-[#FF6B00] hover:shadow-[0_8px_24px_rgba(255,107,0,0.15)] transition-all group"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0AF] text-white font-bold text-sm">A</span>
            <span className="flex flex-col leading-tight">
              <span className="font-semibold text-sm text-[#0F0F0F]">
                {product.seller.reviews} отзывов на Avito
              </span>
              <span className="text-xs text-[#6B6B6B] group-hover:text-[#FF6B00]">
                ★ {product.seller.rating}.0 · перейти к продавцу →
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Auto-scrolling marquee strip */}
      <div className="reviews-marquee relative" aria-roledescription="carousel">
        <div className="reviews-track flex w-max py-2">
          {loop.map((r, i) => (
            <ReviewCard key={i} r={r} />
          ))}
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5F5F5] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5F5F5] to-transparent" aria-hidden />
      </div>

      <p className="text-center text-xs text-[#9a9a9a] mt-6 max-w-2xl mx-auto px-4 leading-relaxed">
        Цитаты приведены с указанием источников и дат для объективной оценки продукта (ст. 1274 ГК РФ).
        Имена сокращены до инициала фамилии. Полный список ссылок предоставляется по запросу.
      </p>

    </section>
  )
}
