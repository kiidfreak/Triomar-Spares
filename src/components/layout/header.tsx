'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X, MapPin, Phone } from 'lucide-react'
import { SearchBar } from '@/components/search/search-bar'
import { CartDrawer } from '@/components/cart/cart-drawer'
import { UserMenu } from '@/components/auth/user-menu'
import { MobileMenu } from '@/components/layout/mobile-menu'
import { useCart } from '@/components/cart/cart-context'
import { useAuth } from '@/components/auth/auth-context'

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { state: { user } } = useAuth()
  const { state: cartState, toggleCart, closeCart } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top promo bar */}
      <div className="bg-orange-500 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="text-center text-sm font-medium">
            <Link href="/deals" className="hover:text-white/90 transition-colors">
              🚗 20% off orders over KSH 10,000 + Free Ground Shipping* - Use Code: UPNRUNNING
            </Link>
          </div>
        </div>
      </div>

      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+44 7349 013628</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>34 Lillington Close, M22 1LY, Manchester</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/help" className="hover:text-primary-foreground/80">
                Help & Support
              </Link>
              <Link href="/contact" className="hover:text-primary-foreground/80">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary">Triomah Spares</div>
              {/* <div className="text-sm text-muted-foreground">Ltd</div> */}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block">
            <ul className="flex items-center space-x-4 py-3 text-sm font-medium">
              <li className="relative group">
                <button className="flex items-center space-x-1 hover:text-primary transition-colors whitespace-nowrap">
                  <span>Our Vehicles</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link href="/vehicles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      All Vehicles
                    </Link>
                    <Link href="/categories/mazda-cx5" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Mazda CX-5
                    </Link>
                    <Link href="/categories/nissan-xtrail" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Nissan X-Trail
                    </Link>
                    <Link href="/categories/toyota-prado" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Toyota Prado
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <Link href="/categories/engine-filters" className="hover:text-primary transition-colors whitespace-nowrap">
                  Engine & Filters
                </Link>
              </li>
              <li>
                <Link href="/categories/brakes-suspension" className="hover:text-primary transition-colors whitespace-nowrap">
                  Brakes & Suspension
                </Link>
              </li>
              <li>
                <Link href="/categories/electrical" className="hover:text-primary transition-colors whitespace-nowrap">
                  Electrical
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Search */}
            <div className="hidden md:block">
              <SearchBar />
            </div>

            {/* User menu */}
            <UserMenu />

            {/* Cart */}
            <button
              onClick={() => toggleCart()}
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartState.items.length}
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden mt-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

    </header>
  )
}
