'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Wrench, Battery, Droplets, Filter, Zap, Car, Shield } from 'lucide-react'

const categories = [
  {
    id: 'mazda-cx5',
    name: 'Mazda CX-5',
    description: 'Engine filters, brakes, suspension, transmission parts',
    icon: Car,
    image: '/images/categories/brakes.jpg',
    color: 'from-red-500 to-red-600',
    count: '500+ parts'
  },
  {
    id: 'nissan-xtrail',
    name: 'Nissan X-Trail T30',
    description: 'Engine parts, brakes, suspension, electrical components',
    icon: Car,
    image: '/images/categories/batteries.jpg',
    color: 'from-blue-500 to-blue-600',
    count: '400+ parts'
  },
  {
    id: 'toyota-prado',
    name: 'Toyota Prado',
    description: 'Engine filters, brakes, suspension, cooling system',
    icon: Car,
    image: '/images/categories/oil-fluids.jpg',
    color: 'from-amber-500 to-amber-600',
    count: '600+ parts'
  },
  {
    id: 'engine-filters',
    name: 'Engine & Filters',
    description: 'Oil filters, air filters, fuel filters, spark plugs',
    icon: Filter,
    image: '/images/categories/filters.jpg',
    color: 'from-green-500 to-green-600',
    count: '200+ parts'
  },
  {
    id: 'brakes-suspension',
    name: 'Brakes & Suspension',
    description: 'Brake pads, discs, shock absorbers, control arms',
    icon: Shield,
    image: '/images/categories/lighting.jpg',
    color: 'from-yellow-500 to-yellow-600',
    count: '300+ parts'
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Batteries, alternators, starter motors, lighting',
    icon: Zap,
    image: '/images/categories/accessories.jpg',
    color: 'from-purple-500 to-purple-600',
    count: '250+ parts'
  }
]

export function FeaturedCategories() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Specialized Vehicle Parts
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. 
            Quality components for engine, brakes, suspension, and electrical systems.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block"
            >
              <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className={`bg-gradient-to-r ${category.color} p-3 rounded-full text-white shadow-lg`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Part Count */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-background/90 text-foreground text-sm px-3 py-1 rounded-full font-medium">
                      {category.count}
                    </span>
                  </div>
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-medium text-sm">
                      Shop Now
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories CTA */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="btn-outline text-lg px-8 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            View All Categories
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
