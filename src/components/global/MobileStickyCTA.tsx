'use client'
import { motion, AnimatePresence, useReducedMotion } from '@/lib/motion'
import { useEffect, useState } from 'react'
import { copy } from '@/content/copy'
import { product } from '@/content/product'

export default function MobileStickyCTA() {
  const [visible, setVisible] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setVisible(progress > 0.3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 sm:hidden"
          initial={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduce ? { opacity: 1 } : { opacity: 0, y: 56 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-14 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
            <a
              href={`tel:${product.contact.phone.replace(/[^+\d]/g, '')}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-br from-[#FF6B00] to-[#EA580C] text-white font-[family-name:var(--font-family-display)] font-bold text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
              </svg>
              {copy.mobileCta.call}
            </a>
            <a
              href={product.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#229ED9] text-white font-[family-name:var(--font-family-display)] font-bold text-sm"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
              </svg>
              {copy.mobileCta.telegram}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
