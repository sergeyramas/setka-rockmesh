import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import LenisProvider from '@/components/global/LenisProvider'
import MobileStickyCTA from '@/components/global/MobileStickyCTA'
import './globals.css'

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
  title: 'Сетка стеклопластиковая ROCKMESH — 150 ₽/м² от производителя Гален',
  description:
    'Стеклопластиковая сетка 5-150×150 мм производства Гален. ISO 9001:2015. Доставка СДЭК по всей России. Цена 150 ₽/м².',
  openGraph: {
    title: 'ROCKMESH — стеклопластиковая сетка 150 ₽/м²',
    description: 'Не экономьте на качестве. Производство Гален. ISO 9001:2015.',
    images: ['/og.png'],
  },
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
        <LenisProvider>
          {children}
        </LenisProvider>
        <MobileStickyCTA />
      </body>
    </html>
  )
}
