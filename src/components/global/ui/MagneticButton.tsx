'use client'
import { useRef } from 'react'
import { motion, useReducedMotion } from '@/lib/motion'

interface Props {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  children: React.ReactNode
  className?: string
}

export default function MagneticButton({
  href,
  onClick,
  variant = 'primary',
  children,
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  function handleMouseMove(e: React.MouseEvent) {
    if (shouldReduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }

  function handleMouseLeave() {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  const variantClass = {
    primary: 'bg-accent text-white hover:bg-accent-hover',
    secondary: 'bg-green-500 text-white hover:bg-green-400',
    ghost: 'border border-black/20 text-[#0F0F0F] hover:border-accent hover:text-accent',
  }[variant]

  const inner = (
    <span
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[8px] font-[family-name:var(--font-family-display)] font-bold text-sm transition-colors duration-200 ${variantClass} ${className}`}
    >
      {children}
    </span>
  )

  return (
    <div
      ref={ref}
      className="inline-block transition-transform duration-200 ease-out"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {href ? (
        <a href={href}>{inner}</a>
      ) : (
        <button onClick={onClick}>{inner}</button>
      )}
    </div>
  )
}
