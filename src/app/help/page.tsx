import { Metadata } from 'next'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Truck, CreditCard, Shield, HelpCircle, FileText, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help & Support | Triomah Spares Ltd',
  description: 'Get help and support for your car spare parts needs. FAQ, contact information, shipping details, and customer service.',
}

const faqs = [
  {
    question: "How do I find the right parts for my vehicle?",
    answer: "Use our vehicle selector tool or search by make, model, and year. You can also browse our specific vehicle categories for Mazda CX-5, Nissan X-Trail, and Toyota Prado."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard delivery takes 3-5 business days within the UK. Express shipping (1-2 business days) is available for an additional fee. International shipping varies by location."
  },
  {
    question: "Do you offer returns or exchanges?",
    answer: "Yes, we offer a 30-day return policy for unused items in original packaging. Defective parts are covered by manufacturer warranty and can be exchanged."
  },
  {
    question: "Can I get technical support for installation?",
    answer: "While we don't provide installation services, our team can offer basic guidance on part compatibility and general installation tips. For complex installations, we recommend consulting a qualified mechanic."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries. International shipping rates and delivery times vary by location. Contact us for specific rates to your country."
  }
]

const supportCategories = [
  {
    icon: <HelpCircle className="h-8 w-8" />,
    title: "General Inquiries",
    description: "Questions about our products, services, or company",
    contact: "info@triomahspares.co.uk"
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Shipping & Delivery",
    description: "Order tracking, shipping rates, and delivery issues",
    contact: "shipping@triomahspares.co.uk"
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "Billing & Payments",
    description: "Payment issues, refunds, and billing questions",
    contact: "billing@triomahspares.co.uk"
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Technical Support",
    description: "Part compatibility and technical assistance",
    contact: "support@triomahspares.co.uk"
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Help & Support</h1>
          <p className="text-lg text-gray-600">We're here to help with all your car spare parts needs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+44 7349 013628</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">info@triomahspares.co.uk</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">34 Lillington Close, M22 1LY, Manchester</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Support Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportCategories.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-primary">{category.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        <p className="text-sm text-primary font-medium">{category.contact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option>General Inquiry</option>
                    <option>Product Support</option>
                    <option>Shipping Question</option>
                    <option>Technical Support</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/vehicles" className="block text-primary hover:text-primary/80 transition-colors">
                  Browse Vehicles
                </Link>
                <Link href="/deals" className="block text-primary hover:text-primary/80 transition-colors">
                  Current Deals
                </Link>
                <Link href="/categories/engine-filters" className="block text-primary hover:text-primary/80 transition-colors">
                  Engine & Filters
                </Link>
                <Link href="/categories/brakes-suspension" className="block text-primary hover:text-primary/80 transition-colors">
                  Brakes & Suspension
                </Link>
                <Link href="/categories/electrical" className="block text-primary hover:text-primary/80 transition-colors">
                  Electrical Parts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
