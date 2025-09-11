'use client'

import { Wrench, Car, Settings, Zap, Shield, Truck } from 'lucide-react'
import Link from 'next/link'

export function GarageThemeDemo() {
  return (
    <div className="min-h-screen bg-gray-50 garage-pattern">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6 animate-garage-pulse">
            🚗 Triomar Garage
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Professional automotive parts and services with industrial-grade quality
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/deals" className="garage-button animate-red-glow">
              Shop Parts
            </Link>
            <Link href="/contact" className="garage-button-outline">
              Book Service
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20" style={{backgroundColor: 'rgb(17 24 39/var(--tw-bg-opacity,1))'}}>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Why Choose Our Garage?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wrench className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Expert Mechanics</h3>
              <p className="text-gray-600">Certified technicians with years of experience in automotive repair</p>
            </div>

            {/* Feature Card 2 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quality Parts</h3>
              <p className="text-gray-600">Genuine OEM and premium aftermarket parts for all vehicle makes</p>
            </div>

            {/* Feature Card 3 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Advanced Diagnostics</h3>
              <p className="text-gray-600">State-of-the-art equipment for accurate problem identification</p>
            </div>

            {/* Feature Card 4 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Service</h3>
              <p className="text-gray-600">Fast turnaround times without compromising on quality</p>
            </div>

            {/* Feature Card 5 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Warranty</h3>
              <p className="text-gray-600">Comprehensive warranty coverage on all parts and labor</p>
            </div>

            {/* Feature Card 6 */}
            <div className="garage-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Mobile Service</h3>
              <p className="text-gray-600">On-site repairs and maintenance for your convenience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Section */}
      <section className="py-20 bg-gray-900 text-white industrial-pattern">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Industrial-Grade Solutions</h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto">
            From heavy machinery to passenger vehicles, we provide professional-grade automotive solutions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="industrial-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Commercial Fleet</h3>
              <p>Complete fleet maintenance and repair services for businesses</p>
            </div>
            
            <div className="industrial-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Heavy Equipment</h3>
              <p>Specialized service for construction and industrial vehicles</p>
            </div>
            
            <div className="industrial-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">Emergency Service</h3>
              <p>24/7 roadside assistance and emergency repairs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="bg-white text-red-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition-colors duration-300">
              Get Quote
            </Link>
            <a href="tel:+447349013628" className="border-2 border-white text-white hover:bg-white hover:text-red-600 font-bold py-4 px-8 rounded-lg transition-colors duration-300">
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
