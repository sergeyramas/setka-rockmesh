import { copy } from '@/content/copy'

export default function Marquee() {
  const items = [...copy.marquee, ...copy.marquee]

  return (
    <div
      className="w-full overflow-hidden bg-[#0F0F0F] border-y border-white/10 py-4"
      aria-hidden="true"
    >
      <div className="flex gap-12 w-max [animation:marquee_20s_linear_infinite] motion-reduce:animation-none">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-accent font-[family-name:var(--font-family-display)] font-bold text-sm uppercase tracking-widest whitespace-nowrap"
          >
            {item}
            <span className="mx-6 text-white/20">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
