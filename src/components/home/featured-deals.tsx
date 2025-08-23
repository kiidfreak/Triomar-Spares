'use client'

import Image from 'next/image'
import Link from 'next/link'

const featuredDeals = [
  {
    id: 1,
    title: "STP Filter Bundle Deal",
    subtitle: "Get an STP Air Filter, STP Cabin Air Filter, & STP Extended Life Oil Filter for KSH 4,999",
    image: "/images/Only 4999.png",
    link: "/deals",
    alt: "STP Filter Bundle",
    note: "Sales tax not included"
  },
  {
    id: 2,
    title: "STP Regular Filter Bundle",
    subtitle: "Get an STP Air Filter, STP Cabin Air Filter, & STP Oil Filter for KSH 3,999",
    image: "/images/Only 3999.png",
    link: "/deals",
    alt: "STP Regular Filters"
  },
  {
    id: 3,
    title: "Lucas Fuel Treatment",
    subtitle: "2 for KSH 1,200 Lucas Fuel Treatment",
    image: "/images/2 for 800.png",
    link: "/deals",
    alt: "Lucas Fuel Treatment",
    note: "Must buy 2"
  },
  {
    id: 4,
    title: "ProElite Microfiber Towels",
    subtitle: "Save KSH 800 on ProElite Microfiber Towels 6 pack",
    image: "/images/save 800.png",
    link: "/deals",
    alt: "ProElite Microfiber Towels"
  },
  {
    id: 5,
    title: "Duralast Wrench Set",
    subtitle: "Save KSH 700 on Duralast Socket Wrench Set",
    image: "/images/save 700.png",
    link: "/deals",
    alt: "Duralast Wrench Set"
  }
]

export function FeaturedDeals() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            FEATURED DEALS
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Featured Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
              <Link href={deal.link} className="block">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {deal.subtitle}
                  </p>
                  {deal.note && (
                    <p className="text-sm text-gray-500 font-medium">
                      {deal.note}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Show All Deals Button */}
        <div className="text-center mt-12">
          <Link
            href="/deals"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            SHOW ALL DEALS
          </Link>
        </div>
      </div>
    </section>
  )
}
