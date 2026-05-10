import styles from './card.module.css'

interface Props {
  price: number
  unit: string
}

export default function CardPrice({ price, unit }: Props) {
  return (
    <div className={styles.priceRow}>
      <span className={styles.price}>{price}</span>
      <span className={styles.priceUnit}>{unit}</span>
    </div>
  )
}
