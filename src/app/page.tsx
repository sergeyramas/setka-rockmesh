import MarketplaceCard from '@/components/card/MarketplaceCard'
import Marquee from '@/components/transitions/Marquee'
import Hero from '@/components/landing/Hero'
import CompareSlider from '@/components/landing/CompareSlider'
import FourProperties from '@/components/landing/FourProperties'
import Composition from '@/components/landing/Composition'
import UseCasesBento from '@/components/landing/UseCasesBento'
import TechSpecs from '@/components/landing/TechSpecs'
import Manufacturer from '@/components/landing/Manufacturer'
import Certificates from '@/components/landing/Certificates'
import RealReviews from '@/components/landing/RealReviews'
import Delivery from '@/components/landing/Delivery'
import DeliveryCalculator from '@/components/landing/DeliveryCalculator'
import FinalCTA from '@/components/landing/FinalCTA'

export default function Page() {
  return (
    <main>
      <MarketplaceCard />

      <Marquee />

      <Hero />
      <CompareSlider />
      <FourProperties />
      <Composition />
      <UseCasesBento />
      <TechSpecs />
      <Manufacturer />
      <Certificates />
      <RealReviews />
      <Delivery />
      <DeliveryCalculator />
      <FinalCTA />
    </main>
  )
}
