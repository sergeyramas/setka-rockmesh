import styles from './card.module.css'

interface Props {
  name: string
  company: string
  rating: number
  reviews: number
  since: number
  badges: readonly string[]
}

export default function CardSeller({ name, company, rating, reviews, since, badges }: Props) {
  return (
    <div className={styles.seller}>
      <div className={styles.sellerAvatar}>{name[0]}</div>
      <div>
        <div className={styles.sellerName}>{name} · {company}</div>
        <div className={styles.sellerMeta}>
          {'★'.repeat(rating)} · {reviews} отзыва · на сайте с {since}
        </div>
        <div className={styles.sellerBadges}>
          {badges.map((b) => (
            <span key={b} className={styles.sellerBadge}>✓ {b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
