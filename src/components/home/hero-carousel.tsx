'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: "Premium Brake Pads Collection",
    subtitle: "High-performance brake pads for all vehicle types. Quality guaranteed with free shipping on orders over KSH 10,000",
    image: "/images/brake-pads-v2-d.jpeg",
    link: "/categories/brakes-suspension",
    alt: "Premium Brake Pads Collection"
  },
  {
    id: 2,
    title: "Professional Grade Brake Components",
    subtitle: "Expert-engineered brake systems for Mazda CX-5, Nissan X-Trail, and Toyota Prado models",
    image: "/images/brake-pads-v2-e.jpeg",
    link: "/categories/brakes-suspension",
    alt: "Professional Grade Brake Components"
  },
  {
    id: 3,
    title: "Complete Brake System Solutions",
    subtitle: "From brake pads to rotors - everything you need for safe and reliable braking performance",
    image: "/images/brake-pads-v2-f.jpeg",
    link: "/categories/brakes-suspension",
    alt: "Complete Brake System Solutions"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)



  // Safety check: Ensure currentSlide is within valid bounds
  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0)
    }
  }, [currentSlide, heroSlides.length])

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1
        return next >= heroSlides.length ? 0 : next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1
      return next >= heroSlides.length ? 0 : next
    })
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      const previous = prev - 1
      return previous < 0 ? heroSlides.length - 1 : previous
    })
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative bg-gray-100">
      {/* Hero Carousel */}
      <div className="relative overflow-hidden">
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Link href={slide.link} className="block h-full">
                <div className="relative h-full w-full">
                                     <Image
                     src={slide.image}
                     alt={slide.alt}
                     fill
                     sizes="100vw"
                     className="object-cover"
                     priority={index === 0}
                   />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-end justify-center pb-10">
                    <div className="text-center text-white max-w-4xl mx-auto px-4">
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 text-gray-800" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 text-gray-800" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-gray-800" />
          ) : (
            <Play className="h-5 w-5 text-gray-800" />
          )}
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-gray-800">
          {currentSlide + 1} of {heroSlides.length}
        </div>
      </div>
    </section>
  )
}
