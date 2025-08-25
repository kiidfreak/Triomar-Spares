'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend
  
      setIsSubscribed(true)
      setEmail('')
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-white/90" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              GET IN THE ZONE
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Subscribe to get the latest deals, promotions, and offerings.
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                SUBSCRIBE
              </button>
            </div>
          </form>

          {/* Success Message */}
          {isSubscribed && (
            <div className="mt-6 p-4 bg-white/20 rounded-lg">
              <p className="text-white font-medium">
                Thank you for subscribing! You'll receive our latest updates soon.
              </p>
            </div>
          )}

          {/* Additional Info */}
          <div className="mt-8 text-sm text-white/80">
            <p>
              By subscribing, you agree to receive marketing emails from Triomah Spares Ltd. 
              You can unsubscribe at any time. View our{' '}
              <a href="/privacy" className="underline hover:text-white transition-colors">
                Privacy Policy
              </a>{' '}
              for more information.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
