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
      <a href={`tel:${phone}`} className={styles.ctaCall}>
        📞 {callLabel}
      </a>
      <a href={telegramLink} target="_blank" rel="noopener noreferrer" className={styles.ctaWa}>
        💬 {tgLabel}
      </a>
      <p className={styles.ctaTagline}>{tagline}</p>
    </div>
  )
}
