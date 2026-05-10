'use client'
import { useState } from 'react'
import Image from 'next/image'
import styles from './card.module.css'
import Lightbox from '@/components/global/ui/Lightbox'

interface Props {
  photos: readonly string[]
  productName: string
}

export default function CardGallery({ photos, productName }: Props) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage} onClick={() => setLightboxOpen(true)}>
        <Image
          src={photos[active]}
          alt={`${productName} — фото ${active + 1}`}
          width={800}
          height={800}
          className="w-full h-full object-cover transition-opacity duration-300"
          priority={active === 0}
        />
      </div>
      <div className={styles.thumbsRow}>
        {photos.map((src, i) => (
          <button
            key={src}
            className={`${styles.thumb}${i === active ? ` ${styles.active}` : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Фото ${i + 1}`}
          >
            <Image src={src} alt="" width={64} height={64} className="object-cover w-full h-full" />
          </button>
        ))}
      </div>
      <Lightbox
        src={photos[active]}
        alt={`${productName} — фото ${active + 1}`}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
