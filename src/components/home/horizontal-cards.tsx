'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const horizontalCards = [
  {
    id: 1,
    title: "SHOP LOCAL STORE DEALS",
    subtitle: "View your monthly ad",
    image: "/images/localstore.jpeg",
    link: "/circular",
    alt: "Monthly Store Deals"
  },
  {
    id: 2,
    title: "OIL AND FILTER DEALS",
    subtitle: "Bundle and save up to KSH 3,200",
    image: "/images/oilfilterdeals.jpeg",
    link: "/categories/engine-filters",
    alt: "Oil Change Specials"
  },
  {
    id: 3,
    title: "GEAR UP WITH SAVINGS",
    subtitle: "Stay ready this back-to-school season",
    image: "/images/gearupsavings.jpeg",
    link: "/deals",
    alt: "Back to School Deals"
  },
  {
    id: 4,
    title: "GET IT FAST",
    subtitle: "Pick up in-store today, or get it quickly with Same Day Delivery",
    image: "/images/getitfast.jpeg",
    link: "/delivery",
    alt: "Fast Delivery Options"
  },
  {
    id: 5,
    title: "HAVE A JOB?",
    subtitle: "Check out step-by-step guides and solutions",
    image: "/images/haveajob.jpeg",
    link: "/diy",
    alt: "DIY Repair Guides"
  },
  {
    id: 6,
    title: "ENGINE LIGHT ON?",
    subtitle: "We'll check it and give you a free Fix Finder report.",
    image: "/images/enginelighton.webp",
    link: "/fix-finder",
    alt: "Fix Finder Service"
  },
  {
    id: 7,
    title: "FULL BATTERY SERVICE",
    subtitle: "Free testing and charging in-store",
    image: "/images/fullbattery.jpeg",
    link: "/categories/electrical",
    alt: "Battery Service"
  }
]

export function HorizontalCards() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Services & Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to keep your vehicle running smoothly
          </p>
        </div>

        {/* Horizontal Cards Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            onScroll={checkScrollButtons}
          >
            {horizontalCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <Link href={card.link} className="block">
                  <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                                         <Image
                       src={card.image}
                       alt={card.alt}
                       fill
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                       className="object-cover hover:scale-105 transition-transform duration-300"
                     />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {card.subtitle}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
