import styles from './card.module.css'

interface Props {
  phone: string
  whatsappLink: string
  callLabel: string
  waLabel: string
  tagline: string
}

export default function CardCTA({ phone, whatsappLink, callLabel, waLabel, tagline }: Props) {
  return (
    <div className={styles.ctaRow}>
      <a href={`tel:${phone}`} className={styles.ctaCall}>
        📞 {callLabel}
      </a>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaWa}>
        💬 {waLabel}
      </a>
      <p className={styles.ctaTagline}>{tagline}</p>
    </div>
  )
}
