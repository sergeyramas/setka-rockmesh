'use client'
import { AnimatePresence, motion } from '@/lib/motion'
import Image from 'next/image'
import { useEffect } from 'react'

interface Props {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function Lightbox({ src, alt, isOpen, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-3xl w-full max-h-[90vh] rounded-[16px] overflow-hidden"
            layoutId={`cert-${src}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={900}
              className="w-full h-auto object-contain"
            />
          </motion.div>
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
