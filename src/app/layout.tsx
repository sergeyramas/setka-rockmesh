import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import LenisProvider from '@/components/global/LenisProvider'
import MobileStickyCTA from '@/components/global/MobileStickyCTA'
import Footer from '@/components/global/Footer'
import { product } from '@/content/product'
import './globals.css'

// TODO: replace with the real production domain once registered
const SITE_URL = 'https://rockmesh.example'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const interTight = Inter_Tight({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter-tight',
  weight: ['700', '800'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Сетка стеклопластиковая ROCKMESH — 150 ₽/м² от производителя Гален',
  description:
    'Стеклопластиковая сетка 5-150×150 мм производства Гален. ISO 9001:2015. Доставка СДЭК по всей России. Цена 150 ₽/м².',
  keywords: [
    'стеклопластиковая сетка',
    'композитная сетка',
    'ROCKMESH',
    'Гален',
    'армирование бетона',
    'сетка 150x150',
    'ISO 9001',
    'сетка для кладки',
    'композитная арматура',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'ROCKMESH',
    title: 'ROCKMESH — стеклопластиковая сетка 150 ₽/м²',
    description: 'Не экономьте на качестве. Производство Гален. ISO 9001:2015.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROCKMESH — стеклопластиковая сетка 150 ₽/м²',
    description: 'Не экономьте на качестве. Производство Гален. ISO 9001:2015.',
    images: ['/og.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ООО «Гален»',
      url: 'https://galencomposite.ru',
      email: product.manufacturer.email,
      telephone: product.manufacturer.phone,
      identifier: {
        '@type': 'PropertyValue',
        propertyID: 'ОГРН',
        value: product.manufacturer.ogrnNumber,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: product.manufacturer.address,
        addressLocality: product.manufacturer.city,
        addressCountry: 'RU',
      },
    },
    {
      '@type': 'Product',
      '@id': `${SITE_URL}/#product`,
      name: product.name,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      manufacturer: { '@id': `${SITE_URL}/#organization` },
      description:
        'Стеклопластиковая композитная сетка 5-150×150 мм для армирования бетона, кладки и фундаментов. Ячейка 150×150 мм, пруток Ø 5 мм. Сертификат ISO 9001:2015 (Bureau Veritas).',
      material: product.specs.material,
      weight: {
        '@type': 'QuantitativeValue',
        value: '650',
        unitCode: 'GRM',
        unitText: 'г/м²',
      },
      image: [
        `${SITE_URL}${product.photos.main}`,
        `${SITE_URL}${product.photos.gallery[1]}`,
      ],
      hasCertification: [
        {
          '@type': 'Certification',
          name: 'ISO 9001:2015',
          issuedBy: { '@type': 'Organization', name: 'Bureau Veritas' },
        },
        {
          '@type': 'Certification',
          name: 'РОСС RU.АГ25.Н12228',
          issuedBy: { '@type': 'Organization', name: 'Рус-Тест' },
        },
      ],
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'RUB',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: product.price,
          priceCurrency: 'RUB',
          referenceQuantity: {
            '@type': 'QuantitativeValue',
            value: 1,
            unitCode: 'MTK',
            unitText: 'м²',
          },
        },
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@id': `${SITE_URL}/#organization` },
        areaServed: 'RU',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // SSR-rendered JSON-LD so Googlebot sees the schema in the source HTML
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LenisProvider>
          {children}
          <Footer />
          <MobileStickyCTA />
        </LenisProvider>
      </body>
    </html>
  )
}
