'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ArrowUp } from 'lucide-react'

const footerLinks = {
  shop: [
    { name: 'All Parts', href: '/shop' },
    { name: 'Mazda CX-5', href: '/categories/mazda-cx5' },
    { name: 'Nissan X-Trail T30', href: '/categories/nissan-xtrail' },
    { name: 'Toyota Prado', href: '/categories/toyota-prado' },
    { name: 'Engine & Filters', href: '/categories/engine-filters' },
    { name: 'Brakes & Suspension', href: '/categories/brakes-suspension' },
    { name: 'Electrical', href: '/categories/electrical' },
  ],
  services: [
    { name: 'Vehicle Finder', href: '/vehicle-finder' },
    { name: 'Store Locator', href: '/stores' },
    { name: 'Installation Services', href: '/services/installation' },
    { name: 'Warranty Info', href: '/warranty' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Price Match', href: '/price-match' },
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Live Chat', href: '/chat' },
    { name: 'Order Status', href: '/orders' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'FAQ', href: '/faq' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press & Media', href: '/press' },
    { name: 'Investor Relations', href: '/investors' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'YouTube', icon: Youtube, href: '#' },
]

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="mb-4">
                <div className="text-2xl font-bold text-red-500">Triomah Spares</div>
                <div className="text-sm text-gray-300">Ltd</div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Specialist car spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. 
                Located in Manchester, UK with quality parts and expert support.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-red-500" />
                  <span className="text-gray-300">+44 7349 013628</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-red-500" />
                  <span className="text-gray-300">info@triomahspares.co.uk</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span className="text-gray-300">34 Lillington Close, M22 1LY, Manchester</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-neutral-300 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Company Links */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-neutral-300 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-neutral-300 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-neutral-800 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-neutral-300 mb-4">
              Get the latest deals, new products, and automotive tips delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="btn-primary px-6 py-2">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-neutral-400 text-sm">
              © 2024 AutoParts Hub. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-neutral-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="bg-primary hover:bg-primary/90 p-2 rounded-full transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
