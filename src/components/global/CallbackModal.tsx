'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from '@/lib/motion'

type Props = {
  open: boolean
  onClose: () => void
}

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID
const FORMSPREE_ENDPOINT = FORMSPREE_ID ? `https://formspree.io/f/${FORMSPREE_ID}` : null

export default function CallbackModal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!FORMSPREE_ENDPOINT) {
      setStatus('error')
      setErrorMsg('Форма временно недоступна. Позвоните, пожалуйста, по телефону вверху страницы — мы на связи в рабочее время.')
      return
    }
    setStatus('sending')
    setErrorMsg(null)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          source: 'setka-rockmesh callback modal',
          page: typeof window !== 'undefined' ? window.location.href : '',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
      setStatus('success')
      setTimeout(() => {
        onClose()
        setStatus('idle')
        setName('')
        setPhone('')
      }, 2400)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Не удалось отправить. Позвоните, пожалуйста, по телефону вверху страницы.')
    }
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

            {status === 'success' ? (
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
                    disabled={status === 'sending'}
                    className="bg-[#FF6B00] text-white font-bold py-3 rounded-lg hover:bg-[#EA580C] transition-colors mt-2 shadow-[0_8px_24px_rgba(255,107,0,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? 'Отправляем…' : 'Позвоните мне'}
                  </button>
                </form>
                {status === 'error' && errorMsg && (
                  <p className="text-sm text-[#E53935] mt-3 leading-relaxed">{errorMsg}</p>
                )}
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
