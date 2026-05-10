import DeliveryCalculator from '@/components/landing/DeliveryCalculator'

export const metadata = {
  title: 'Калькулятор доставки ROCKMESH',
  robots: {
    follow: false,
    index: false,
  },
}

export default function DeliveryCalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      <DeliveryCalculator />
    </main>
  )
}
