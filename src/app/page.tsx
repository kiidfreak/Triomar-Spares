import { HeroCarousel } from '@/components/home/hero-carousel'
import { HorizontalCards } from '@/components/home/horizontal-cards'
import { FeaturedDeals } from '@/components/home/featured-deals'
import { PopularCategories } from '@/components/home/popular-categories'
import { NewsletterSignup } from '@/components/home/newsletter-signup'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Free Services Image - Below Navbar */}
      <div className="w-full">
        <Image
          src="/images/freeservices.webp"
          alt="Free Services"
          width={1920}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      
      {/* Hero Carousel Section */}
      <HeroCarousel />
      
      {/* Horizontal Cards Section */}
      <HorizontalCards />
      
      {/* Featured Deals Section */}
      <FeaturedDeals />
      
      {/* Popular Categories Section */}
      <PopularCategories />
      
      {/* Newsletter Signup Section */}
      <NewsletterSignup />
    </div>
  )
}
