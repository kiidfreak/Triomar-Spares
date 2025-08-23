'use client'

import { useState } from 'react'
import { Mail, Gift, Truck, Shield } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // In a real app, this would send the email to your backend
      setIsSubscribed(true)
      setEmail('')
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const benefits = [
    {
      icon: Gift,
      title: 'Exclusive Deals',
      description: 'Get access to member-only discounts and promotions'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Enjoy free shipping on orders over $50'
    },
    {
      icon: Shield,
      title: 'Early Access',
      description: 'Be the first to know about new products and sales'
    }
  ]

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss out on the latest deals, 
              new products, and automotive tips to keep your vehicle running smoothly.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="mb-12">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-foreground text-primary px-6 py-3 rounded-lg font-medium hover:bg-primary-foreground/90 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Success Message */}
            {isSubscribed && (
              <div className="mt-4 text-green-200 animate-fade-in">
                ✓ Thanks for subscribing! Check your email for confirmation.
              </div>
            )}

            <p className="text-sm text-primary-foreground/80 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/20 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {benefit.title}
                </h3>
                <p className="text-primary-foreground/80">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/80 mb-4">
              Join over 50,000 automotive enthusiasts who trust us
            </p>
            <div className="flex justify-center space-x-6 text-sm text-primary-foreground/60">
              <span>✓ No spam, ever</span>
              <span>✓ Unsubscribe anytime</span>
              <span>✓ Secure & private</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
