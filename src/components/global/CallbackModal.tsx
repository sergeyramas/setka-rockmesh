'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'

type Props = {
  open: boolean
  onClose: () => void
}

export default function CallbackModal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    // TODO: wire to backend or formspree/getform endpoint
    setTimeout(() => {
      onClose()
      setSubmitted(false)
      setName('')
      setPhone('')
    }, 2200)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center text-[#6B6B6B] hover:text-[#0F0F0F] text-2xl"
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#00A86B]/10 flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#00A86B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-[family-name:var(--font-family-display)] font-bold text-xl text-[#0F0F0F] mb-2">
                  Спасибо!
                </h3>
                <p className="text-[#6B6B6B] text-sm">
                  Мы перезвоним в течение 15 минут в рабочее время.
                </p>
              </div>
            ) : (
              <>
                <h3 className="font-[family-name:var(--font-family-display)] font-extrabold text-2xl text-[#0F0F0F] mb-2">
                  Заказать обратный звонок
                </h3>
                <p className="text-[#6B6B6B] text-sm mb-6">
                  Оставьте телефон — перезвоним в течение 15 минут и расскажем по партии и доставке.
                </p>
                <form onSubmit={onSubmit} className="flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-black/15 rounded-lg px-4 py-3 text-[#0F0F0F] focus:border-[#FF6B00] focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border border-black/15 rounded-lg px-4 py-3 text-[#0F0F0F] focus:border-[#FF6B00] focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#FF6B00] text-white font-bold py-3 rounded-lg hover:bg-[#EA580C] transition-colors mt-2 shadow-[0_8px_24px_rgba(255,107,0,0.25)]"
                  >
                    Позвоните мне
                  </button>
                </form>
                <p className="text-[10px] text-[#9a9a9a] text-center mt-4 leading-relaxed">
                  Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
