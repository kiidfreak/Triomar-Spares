'use client'

import { Star, Quote } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Car Enthusiast',
    avatar: '/images/testimonials/sarah.jpg',
    rating: 5,
    text: 'AutoParts Hub has been my go-to for all my automotive needs. The quality of parts is exceptional, and their customer service is outstanding. They helped me find the perfect brake pads for my classic Mustang!',
    vehicle: '1967 Ford Mustang'
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'DIY Mechanic',
    avatar: '/images/testimonials/mike.jpg',
    rating: 5,
    text: 'I love how easy it is to find compatible parts on their website. The vehicle finder tool is incredibly accurate, and I\'ve never received the wrong part. Fast shipping too!',
    vehicle: '2018 Honda Civic'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Professional Driver',
    avatar: '/images/testimonials/emily.jpg',
    rating: 5,
    text: 'As someone who drives for a living, I need reliable parts that I can count on. AutoParts Hub has never let me down. Their expert advice has saved me time and money.',
    vehicle: '2020 Toyota Camry'
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Fleet Manager',
    avatar: '/images/testimonials/david.jpg',
    rating: 5,
    text: 'Managing a fleet of 25 vehicles requires quality parts and reliable service. AutoParts Hub delivers both consistently. Their bulk ordering and account management is excellent.',
    vehicle: 'Fleet of 25 vehicles'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Weekend Warrior',
    avatar: '/images/testimonials/lisa.jpg',
    rating: 5,
    text: 'I\'m not a mechanic, but AutoParts Hub makes it easy to find the right parts. Their installation guides and customer support helped me complete my first brake job!',
    vehicle: '2015 Subaru Outback'
  },
  {
    id: 6,
    name: 'Robert Martinez',
    role: 'Performance Enthusiast',
    avatar: '/images/testimonials/robert.jpg',
    rating: 5,
    text: 'For performance upgrades, AutoParts Hub has the best selection. Their technicians understand what I\'m looking for and always recommend the right parts for my goals.',
    vehicle: '2019 BMW 3 Series'
  }
]

export function TestimonialsSection() {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers 
            have to say about their experience with AutoParts Hub.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-background rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/20" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-primary font-medium">
                    {testimonial.vehicle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <div className="bg-muted/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Trusted by Thousands of Customers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24hr</div>
                <div className="text-muted-foreground">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Order Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
