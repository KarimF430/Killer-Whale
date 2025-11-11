import { Metadata } from 'next'
import Footer from '@/components/Footer'
import AdBanner from '@/components/home/AdBanner'
import HeroSection from '@/components/home/HeroSection'
import CarsByBudget from '@/components/home/CarsByBudget'
import PopularCars from '@/components/home/PopularCars'
import BrandSection from '@/components/home/BrandSection'
import UpcomingCars from '@/components/home/UpcomingCars'
import NewLaunchedCars from '@/components/home/NewLaunchedCars'
import LatestCarNews from '@/components/home/LatestCarNews'
import YouTubeVideoPlayer from '@/components/home/YouTubeVideoPlayer'
import PopularComparisons from '@/components/home/PopularComparisons'
import PageSection from '@/components/common/PageSection'
import Card from '@/components/common/Card'
import { staticPageSEO } from '@/lib/seo'

export const metadata: Metadata = staticPageSEO.home

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <AdBanner />
        <HeroSection />
        
        <PageSection background="gray">
          <CarsByBudget />
        </PageSection>
        
        <AdBanner />
        
        <PageSection background="white">
          <PopularCars />
        </PageSection>
        
        <PageSection background="gray">
          <BrandSection />
        </PageSection>
        
        <PageSection background="white">
          <UpcomingCars />
        </PageSection>
        
        <PageSection background="gray">
          <Card className="text-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Get Best Car Deals</h3>
              <p className="opacity-90">Compare prices from multiple dealers</p>
            </div>
          </Card>
        </PageSection>
        
        <PageSection background="white">
          <NewLaunchedCars />
        </PageSection>
        
        <PageSection background="white">
          <PopularComparisons />
        </PageSection>
        
        <PageSection background="white">
          <LatestCarNews />
        </PageSection>
        
        <PageSection background="white">
          <YouTubeVideoPlayer />
        </PageSection>
      </main>
      
      <Footer />
    </div>
  )
}
