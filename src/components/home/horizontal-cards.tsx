'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const horizontalCards = [
  {
    id: 1,
    title: "OIL AND FILTER DEALS",
    subtitle: "Bundle and save up to KSH 3,200",
    image: "/images/oilfilterdeals.jpeg",
    link: "/categories/engine-filters",
    alt: "Oil Change Specials"
  },
  {
    id: 2,
    title: "GEAR UP WITH SAVINGS",
    subtitle: "Stay ready this back-to-school season",
    image: "/images/gearupsavings.jpeg",
    link: "/deals",
    alt: "Back to School Deals"
  },
  {
    id: 3,
    title: "GET IT FAST",
    subtitle: "Pick up in-store today, or get it quickly with Same Day Delivery",
    image: "/images/getitfast.jpeg",
    link: "/delivery",
    alt: "Fast Delivery Options"
  },
  {
    id: 4,
    title: "HAVE A JOB?",
    subtitle: "Check out step-by-step guides and solutions",
    image: "/images/haveajob.jpeg",
    link: "/diy",
    alt: "DIY Repair Guides"
  },
  {
    id: 5,
    title: "ENGINE LIGHT ON?",
    subtitle: "We'll check it and give you a free Fix Finder report.",
    image: "/images/enginelighton.webp",
    link: "/fix-finder",
    alt: "Fix Finder Service"
  },
  {
    id: 6,
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
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      
      // Only show scroll buttons if content is actually wider than container
      const hasOverflow = scrollWidth > clientWidth
      
      if (hasOverflow) {
        const newCanScrollLeft = scrollLeft > 10
        const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 10
        
        // Only update state if values actually changed
        if (newCanScrollLeft !== canScrollLeft) {
          setCanScrollLeft(newCanScrollLeft)
        }
        if (newCanScrollRight !== canScrollRight) {
          setCanScrollRight(newCanScrollRight)
        }
      } else {
        // No overflow, hide both buttons
        setCanScrollLeft(false)
        setCanScrollRight(false)
      }
    }
  }

  const debouncedCheckScrollButtons = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(checkScrollButtons, 100)
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true)
      scrollContainerRef.current.scrollBy({ 
        left: -320, 
        behavior: 'smooth' 
      })
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current && !isScrolling) {
      setIsScrolling(true)
      scrollContainerRef.current.scrollBy({ 
        left: 320, 
        behavior: 'smooth' 
      })
      setTimeout(() => setIsScrolling(false), 500)
    }
  }

  // Check scroll buttons on mount and window resize
  useEffect(() => {
    checkScrollButtons()
    
    const handleResize = () => {
      setTimeout(checkScrollButtons, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Add touch/swipe support
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let startX = 0
    let startScrollLeft = 0
    let isDragging = false

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startScrollLeft = container.scrollLeft
      isDragging = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      
      const currentX = e.touches[0].clientX
      const diff = startX - currentX
      container.scrollLeft = startScrollLeft + diff
    }

    const handleTouchEnd = () => {
      isDragging = false
      checkScrollButtons()
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

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
              disabled={isScrolling}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              disabled={isScrolling}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          )}

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide horizontal-scroll touch-scroll pb-4 snap-x"
            onScroll={debouncedCheckScrollButtons}
          >
            {horizontalCards.map((card) => (
              <div
                key={card.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 snap-start"
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
