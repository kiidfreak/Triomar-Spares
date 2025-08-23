'use client'

import Link from 'next/link'
import { ArrowLeft, Tag, Clock, Truck } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'

const deals = [
  {
    id: 1,
    title: "STP Filter Bundle Deal",
    description: "Get an STP Air Filter, STP Cabin Air Filter, & STP Extended Life Oil Filter for KSH 4,999",
    originalPrice: "KSH 6,999",
    salePrice: "KSH 4,999",
    savings: "Save KSH 2,000",
    image: "/images/Only 4999.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "STP-BUNDLE-1",
    sku: "STP-BUNDLE-1"
  },
  {
    id: 2,
    title: "STP Regular Filter Bundle",
    description: "Get an STP Air Filter, STP Cabin Air Filter, & STP Oil Filter for KSH 3,999",
    originalPrice: "KSH 5,999",
    salePrice: "KSH 3,999",
    savings: "Save KSH 2,000",
    image: "/images/Only 3999.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "STP-BUNDLE-2",
    sku: "STP-BUNDLE-2"
  },
  {
    id: 3,
    title: "Lucas Fuel Treatment",
    description: "2 for KSH 1,200 Lucas Fuel Treatment - Must buy 2",
    originalPrice: "KSH 1,998",
    salePrice: "KSH 1,200",
    savings: "Save KSH 798",
    image: "/images/2 for 800.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "LUCAS-FUEL-2PK",
    sku: "LUCAS-FUEL-2PK"
  },
  {
    id: 4,
    title: "ProElite Microfiber Towels",
    description: "Save KSH 800 on ProElite Microfiber Towels 6 pack",
    originalPrice: "KSH 3,499",
    salePrice: "KSH 2,699",
    savings: "Save KSH 800",
    image: "/images/save 800.png",
    validUntil: "2025-12-31",
    category: "Accessories",
    partNumber: "PROELITE-MF-6PK",
    sku: "PROELITE-MF-6PK"
  },
  {
    id: 5,
    title: "Duralast Wrench Set",
    description: "Save KSH 700 on Duralast Socket Wrench Set",
    originalPrice: "KSH 5,499",
    salePrice: "KSH 4,799",
    savings: "Save KSH 700",
    image: "/images/save 700.png",
    validUntil: "2025-12-31",
    category: "Tools",
    partNumber: "DURALAST-WRENCH",
    sku: "DURALAST-WRENCH"
  },
  {
    id: 6,
    title: "Oil Change Bundle",
    description: "Bundle and save up to KSH 4,000 on oil and filter deals",
    originalPrice: "KSH 6,299",
    salePrice: "KSH 4,399",
    savings: "Save KSH 1,900",
    image: "/images/oilfilterdeals.jpeg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "OIL-BUNDLE-1",
    sku: "OIL-BUNDLE-1"
  }
]

export default function DealsPage() {
  const { addItem, toggleCart } = useCart()

  const handleAddToCart = (deal: any) => {
    const cartItem = {
      id: deal.id,
      name: deal.title,
      price: deal.salePrice,
      image: deal.image,
      partNumber: deal.partNumber,
      sku: deal.sku
    }
    
    addItem(cartItem)
    
    // Show success toast
    toast.success(`${deal.title} added to cart!`)
    
    // Open cart drawer
    toggleCart()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <Tag className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Current Deals</h1>
          </div>
          <p className="text-lg text-gray-600">Limited time offers on quality automotive parts</p>
        </div>
      </div>

      {/* Deals Banner */}
      <div className="w-full">
        <Image
          src="/images/deals.jpeg"
          alt="Deals Banner"
          width={1920}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative aspect-video bg-gray-200 overflow-hidden">
                                 <Image
                   src={deal.image}
                   alt={deal.title}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                   className="object-cover"
                 />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary font-medium">{deal.category}</span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Valid until {new Date(deal.validUntil).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{deal.title}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-primary">{deal.salePrice}</span>
                    <span className="text-sm text-gray-500 line-through">{deal.originalPrice}</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{deal.savings}</span>
                </div>
                <button onClick={() => handleAddToCart(deal)} className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                              <p className="text-gray-600">On orders over KSH 10,000</p>
            </div>
            <div className="flex flex-col items-center">
              <Tag className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">Guaranteed lowest prices</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Limited Time</h3>
              <p className="text-gray-600">Deals expire soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
