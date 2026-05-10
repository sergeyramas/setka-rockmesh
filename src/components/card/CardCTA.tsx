import styles from './card.module.css'

interface Props {
  phone: string
  telegramLink: string
  callLabel: string
  tgLabel: string
  tagline: string
}

export default function CardCTA({ phone, telegramLink, callLabel, tgLabel, tagline }: Props) {
  return (
    <div className={styles.ctaRow}>
      <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className={styles.ctaCall}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        </svg>
        <span>{callLabel}</span>
      </a>
      <a href={telegramLink} target="_blank" rel="noopener noreferrer" className={styles.ctaWa}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
        <span>{tgLabel}</span>
      </a>
      <p className={styles.ctaTagline}>{tagline}</p>
    </div>
  )
}
