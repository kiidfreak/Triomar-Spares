'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Wrench, Truck, Shield, Star } from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Automotive parts background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Specialist Car Spare Parts for
            <span className="text-primary block">Mazda, Nissan & Toyota</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Quality spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. 
            Located in Manchester, UK with fast delivery and expert support.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar 
              placeholder="Search for parts, brands, or vehicle..."
              className="bg-white/95 backdrop-blur-sm"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/shop" 
              className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              Shop Now
            </Link>
            <Link 
              href="/vehicle-finder" 
              className="btn-outline text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900 transition-colors"
            >
              Find Parts for My Vehicle
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Quality Guaranteed</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Fast Shipping</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Expert Support</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-primary/20 p-3 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Customer Rated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce-gentle">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
