'use client'

import { Truck, Shield, Clock, Users, Wrench, Star } from 'lucide-react'

const services = [
  {
    icon: Truck,
    title: 'Fast & Free Shipping',
    description: 'Free shipping on orders over $50. Same-day shipping available for select items.',
    color: 'text-blue-600'
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All parts come with our quality guarantee. 30-day return policy for your peace of mind.',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our expert team is available around the clock to help with any questions or concerns.',
    color: 'text-purple-600'
  },
  {
    icon: Users,
    title: 'Expert Advice',
    description: 'Get personalized recommendations from our certified automotive technicians.',
    color: 'text-orange-600'
  },
  {
    icon: Wrench,
    title: 'Installation Services',
    description: 'Professional installation available at our service centers nationwide.',
    color: 'text-red-600'
  },
  {
    icon: Star,
    title: 'Customer Satisfaction',
    description: 'Join thousands of satisfied customers who trust us with their automotive needs.',
    color: 'text-yellow-600'
  }
]

export function ServicesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose AutoParts Hub?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing the best automotive parts shopping experience 
            with exceptional service, quality products, and competitive prices.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-background rounded-full shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className={`h-8 w-8 ${service.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-background rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Parts Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Store Locations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.9</div>
              <div className="text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
