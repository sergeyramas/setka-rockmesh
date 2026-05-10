'use client'
import { useState } from 'react'
import { product } from '@/content/product'
import CallbackModal from '@/components/global/CallbackModal'

const NAV_LINKS = [
  { href: '#compare', label: 'Сравнение' },
  { href: '#composition', label: 'Состав' },
  { href: '#usecases', label: 'Применение' },
  { href: '#specs', label: 'Характеристики' },
  { href: '#manufacturer', label: 'Производитель' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#delivery', label: 'Доставка' },
]

export default function Header() {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2 shrink-0">
            <span className="font-[family-name:var(--font-family-display)] font-extrabold text-xl tracking-tight text-[#0F0F0F]">
              ROCK<span className="text-[#FF6B00]">MESH</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-[#475569] hover:text-[#FF6B00] transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right cluster: phone + CTA + callback */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`tel:${product.contact.phone.replace(/[^+\d]/g, '')}`}
              className="hidden md:flex flex-col leading-tight text-right hover:text-[#FF6B00] transition-colors"
            >
              <span className="font-[family-name:var(--font-family-mono)] font-bold text-sm text-[#0F0F0F]">
                {product.contact.phoneDisplay}
              </span>
              <span className="text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider">
                Звонок бесплатный
              </span>
            </a>

            <a
              href={product.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#229ED9] text-white hover:bg-[#1A8AC1] transition-colors"
              aria-label="Telegram"
              title="Telegram"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
            </a>

            <button
              type="button"
              onClick={() => setCallbackOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-[0_4px_14px_rgba(255,107,0,0.25)] hover:shadow-[0_8px_24px_rgba(255,107,0,0.35)] hover:-translate-y-px transition-all"
            >
              Обратный звонок
            </button>

            <button
              type="button"
              onClick={() => setCallbackOpen(true)}
              className="nav-callback-pulse relative sm:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FF6B00] text-white hover:bg-[#EA580C] transition-colors"
              aria-label="Заказать обратный звонок"
              title="Заказать обратный звонок"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((s) => !s)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-[#0F0F0F]"
              aria-label="Меню"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-black/5 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold text-[#475569] hover:text-[#FF6B00] py-2 border-b border-black/5 last:border-b-0"
                  onClick={() => setMobileOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={`tel:${product.contact.phone.replace(/[^+\d]/g, '')}`}
                className="font-[family-name:var(--font-family-mono)] font-bold text-base text-[#0F0F0F] mt-2"
              >
                {product.contact.phoneDisplay}
              </a>
            </div>
          </div>
        )}
      </header>

      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </>
  )
}
