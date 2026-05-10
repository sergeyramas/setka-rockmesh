export default function PulsingDot({ color = '#00A86B' }: { color?: string }) {
  return (
    <span
      className="relative inline-flex h-2 w-2"
      aria-hidden="true"
    >
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 motion-reduce:animate-none"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}
