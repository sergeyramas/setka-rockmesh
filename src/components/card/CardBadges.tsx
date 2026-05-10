import styles from './card.module.css'
import PulsingDot from '@/components/global/ui/PulsingDot'

interface Props {
  inStock: string
  brandBadge: string
  isoBadge: string
}

export default function CardBadges({ inStock, brandBadge, isoBadge }: Props) {
  return (
    <div className={styles.badges}>
      <span className={`${styles.badge} ${styles.badgeGreen}`}>
        <PulsingDot /> {inStock}
      </span>
      <span className={`${styles.badge} ${styles.badgeOrange}`}>{brandBadge}</span>
      <span className={`${styles.badge} ${styles.badgeGray}`}>{isoBadge}</span>
    </div>
  )
}
