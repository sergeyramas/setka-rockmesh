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
          <div className="flex h-14 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
            <a
              href={`tel:${product.contact.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] text-white font-[family-name:var(--font-family-display)] font-bold text-sm"
            >
              📞 {copy.mobileCta.call}
            </a>
            <a
              href={product.contact.telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-[#00A86B] text-white font-[family-name:var(--font-family-display)] font-bold text-sm"
            >
              💬 {copy.mobileCta.telegram}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
