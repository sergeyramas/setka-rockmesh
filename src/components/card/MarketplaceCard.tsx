import styles from './card.module.css'
import CardGallery from './CardGallery'
import CardBadges from './CardBadges'
import CardPrice from './CardPrice'
import CardSeller from './CardSeller'
import CardCTA from './CardCTA'
import { product } from '@/content/product'
import { copy } from '@/content/copy'

export default function MarketplaceCard() {
  return (
    <section aria-label="Карточка товара" className={styles.card}>
      <CardGallery photos={product.photos.gallery} productName={product.name} />
      <div className={styles.info}>
        <CardBadges
          inStock={copy.product.inStock}
          brandBadge={copy.product.brandBadge}
          isoBadge={copy.product.isoBadge}
        />
        <h1 className={styles.title}>{copy.product.title}</h1>
        <p className={styles.subtitle}>{copy.product.subtitle}</p>
        <CardPrice price={product.price} unit={product.priceUnit} />
        {/* Specs chips */}
        <div className={styles.specsGrid}>
          <div className={styles.specChip}>
            <div className={styles.specChipLabel}>Ячейка</div>
            <div className={styles.specChipValue}>{product.specs.cell}</div>
          </div>
          <div className={styles.specChip}>
            <div className={styles.specChipLabel}>Диаметр</div>
            <div className={styles.specChipValue}>{product.specs.diameter}</div>
          </div>
          {product.specs.cards.map((c, i) => (
            <div key={i} className={styles.specChip}>
              <div className={styles.specChipLabel}>Карта {i + 1}</div>
              <div className={styles.specChipValue}>{c}</div>
            </div>
          ))}
        </div>
        <CardSeller
          name={product.seller.name}
          company={product.seller.company}
          rating={product.seller.rating}
          reviews={product.seller.reviews}
          since={product.seller.since}
          badges={product.seller.badges}
        />
        <CardCTA
          phone={product.contact.phone}
          whatsappLink={product.contact.whatsappLink}
          callLabel={copy.cta.call}
          waLabel={copy.cta.whatsapp}
          tagline={copy.cta.callTagline}
        />
      </div>
    </section>
  )
}
