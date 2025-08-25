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
    originalPrice: "KSH 4,999",
    salePrice: "KSH 3,499",
    savings: "Save KSH 1,500",
    image: "/images/Only 4999.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "STP-BUNDLE-1",
    sku: "STP-BUNDLE-1"
  },
  {
    id: 2,
    title: "STP Regular Filter Bundle",
    description: "Get an STP Air Filter, STP Cabin Air Filter, & STP Oil Filter for KSH 2,799",
    originalPrice: "KSH 3,999",
    salePrice: "KSH 2,799",
    savings: "Save KSH 1,200",
    image: "/images/Only 3999.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "STP-BUNDLE-2",
    sku: "STP-BUNDLE-2"
  },
  {
    id: 3,
    title: "Lucas Fuel Treatment 2-Pack",
    description: "2 for KSH 999 Lucas Fuel Treatment - Must buy 2",
    originalPrice: "KSH 1,798",
    salePrice: "KSH 999",
    savings: "Save KSH 799",
    image: "/images/2 for 800.png",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "LUCAS-FUEL-2PK",
    sku: "LUCAS-FUEL-2PK"
  },
  {
    id: 4,
    title: "ProElite Microfiber Towels 6-Pack",
    description: "Save KSH 600 on ProElite Microfiber Towels 6 pack",
    originalPrice: "KSH 2,499",
    salePrice: "KSH 1,899",
    savings: "Save KSH 600",
    image: "/images/save 800.png",
    validUntil: "2025-12-31",
    category: "Accessories",
    partNumber: "PROELITE-MF-6PK",
    sku: "PROELITE-MF-6PK"
  },
  {
    id: 5,
    title: "Duralast Professional Wrench Set",
    description: "Save KSH 800 on Duralast Professional Socket Wrench Set",
    originalPrice: "KSH 3,999",
    salePrice: "KSH 3,199",
    savings: "Save KSH 800",
    image: "/images/save 700.png",
    validUntil: "2025-12-31",
    category: "Tools",
    partNumber: "DURALAST-WRENCH",
    sku: "DURALAST-WRENCH"
  },
  {
    id: 6,
    title: "Oil Change Complete Bundle",
    description: "Bundle and save up to KSH 2,500 on oil and filter deals",
    originalPrice: "KSH 4,499",
    salePrice: "KSH 2,999",
    savings: "Save KSH 1,500",
    image: "/images/oilfilterdeals.jpeg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "OIL-BUNDLE-1",
    sku: "OIL-BUNDLE-1"
  },
  {
    id: 7,
    title: "Brembo Premium Brake Pads Set",
    description: "Front & Rear Brembo Premium Brake Pads for most vehicles",
    originalPrice: "KSH 8,999",
    salePrice: "KSH 6,499",
    savings: "Save KSH 2,500",
    image: "/images/brake-pads-v2-d.jpeg",
    validUntil: "2025-12-31",
    category: "Brakes & Suspension",
    partNumber: "BREMBO-BRAKE-SET",
    sku: "BREMBO-BRAKE-SET"
  },
  {
    id: 8,
    title: "Bosch Battery + Installation",
    description: "Bosch S4 Car Battery with free installation service",
    originalPrice: "KSH 7,999",
    salePrice: "KSH 5,999",
    savings: "Save KSH 2,000",
    image: "/images/fullbattery.jpeg",
    validUntil: "2025-12-31",
    category: "Electrical",
    partNumber: "BOSCH-BAT-INSTALL",
    sku: "BOSCH-BAT-INSTALL"
  },
  {
    id: 9,
    title: "Mobil 1 Oil + Filter Combo",
    description: "5L Mobil 1 Synthetic Oil + Premium Oil Filter",
    originalPrice: "KSH 5,499",
    salePrice: "KSH 3,999",
    savings: "Save KSH 1,500",
    image: "/images/oilfilterdeals.jpeg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "MOBIL1-COMBO",
    sku: "MOBIL1-COMBO"
  },
  {
    id: 10,
    title: "Philips LED Headlight Bulbs Pair",
    description: "Philips X-tremeVision LED Headlight Bulbs - Brighter than standard",
    originalPrice: "KSH 3,499",
    salePrice: "KSH 2,499",
    savings: "Save KSH 1,000",
    image: "/images/Philips LED Headlight Bulbs Pair.jpg",
    validUntil: "2025-12-31",
    category: "Lighting",
    partNumber: "PHILIPS-LED-PAIR",
    sku: "PHILIPS-LED-PAIR"
  },
  {
    id: 11,
    title: "K&N Air Filter + Cleaner Kit",
    description: "K&N Performance Air Filter with cleaning and oiling kit",
    originalPrice: "KSH 4,999",
    salePrice: "KSH 3,499",
    savings: "Save KSH 1,500",
    image: "/images/K&N Air Filter + Cleaner Kit.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "KN-AIR-CLEANER",
    sku: "KN-AIR-CLEANER"
  },
  {
    id: 12,
    title: "Monroe Shock Absorbers Set",
    description: "Monroe Reflex Shock Absorbers - Front or Rear Set",
    originalPrice: "KSH 12,999",
    salePrice: "KSH 8,999",
    savings: "Save KSH 4,000",
    image: "/images/Monroe Shock Absorbers Set.JPG",
    validUntil: "2025-12-31",
    category: "Brakes & Suspension",
    partNumber: "MONROE-SHOCKS",
    sku: "MONROE-SHOCKS"
  },
  {
    id: 13,
    title: "NGK Spark Plugs 4-Pack",
    description: "NGK Iridium IX Spark Plugs - Set of 4 for most engines",
    originalPrice: "KSH 2,999",
    salePrice: "KSH 1,999",
    savings: "Save KSH 1,000",
    image: "/images/NGK Spark Plugs 4-Pack.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "NGK-IRIDIUM-4PK",
    sku: "NGK-IRIDIUM-4PK"
  },
  {
    id: 14,
    title: "Castrol Brake Fluid + Bleeding Kit",
    description: "Castrol DOT 4 Brake Fluid with professional bleeding kit",
    originalPrice: "KSH 2,499",
    salePrice: "KSH 1,699",
    savings: "Save KSH 800",
    image: "/images/Castrol Brake Fluid + Bleeding Kit.jpg",
    validUntil: "2025-12-31",
    category: "Brakes & Suspension",
    partNumber: "CASTROL-BRAKE-KIT",
    sku: "CASTROL-BRAKE-KIT"
  },
  {
    id: 15,
    title: "Halfords Advanced Tool Kit",
    description: "Halfords Advanced 150-Piece Tool Kit with carry case",
    originalPrice: "KSH 14,999",
    salePrice: "KSH 9,999",
    savings: "Save KSH 5,000",
    image: "/images/Halfords Advanced Tool Kit.webp",
    validUntil: "2025-12-31",
    category: "Tools",
    partNumber: "HALFORDS-150PK",
    sku: "HALFORDS-150PK"
  },
  {
    id: 16,
    title: "Shell Helix Ultra 5W-30 Oil 4L",
    description: "Shell Helix Ultra Professional 5W-30 Fully Synthetic Engine Oil",
    originalPrice: "KSH 8,999",
    salePrice: "KSH 6,499",
    savings: "Save KSH 2,500",
    image: "/images/Shell Helix Ultra 5W-30 Oil 4L.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "SHELL-HELIX-5W30",
    sku: "SHELL-HELIX-5W30"
  },
  {
    id: 17,
    title: "Castrol Edge 0W-20 Professional",
    description: "Castrol Edge Professional 0W-20 Fully Synthetic Oil 5L",
    originalPrice: "KSH 9,499",
    salePrice: "KSH 6,999",
    savings: "Save KSH 2,500",
    image: "/images/Castrol Edge 0W-20 Professional.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "CASTROL-EDGE-0W20",
    sku: "CASTROL-EDGE-0W20"
  },
  {
    id: 18,
    title: "Mobil 1 ESP X3 0W-30 5L",
    description: "Mobil 1 ESP X3 0W-30 Low SAPS Fully Synthetic Oil",
    originalPrice: "KSH 10,999",
    salePrice: "KSH 7,999",
    savings: "Save KSH 3,000",
    image: "/images/Mobil 1 ESP X3 0W-30 5L.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "MOBIL1-ESP-0W30",
    sku: "MOBIL1-ESP-0W30"
  },
  {
    id: 19,
    title: "Brembo Sport Brake Discs & Pads",
    description: "Brembo Sport Brake Discs & Pads Complete Set - Front & Rear",
    originalPrice: "KSH 29,999",
    salePrice: "KSH 19,999",
    savings: "Save KSH 10,000",
    image: "/images/Brembo Sport Brake Discs & Pads.jpg",
    validUntil: "2025-12-31",
    category: "Brakes & Suspension",
    partNumber: "BREMBO-SPORT-COMPLETE",
    sku: "BREMBO-SPORT-COMPLETE"
  },
  {
    id: 20,
    title: "Bilstein B8 Performance Shocks",
    description: "Bilstein B8 Performance Shocks - Set of 4 for Sport Suspension",
    originalPrice: "KSH 44,999",
    salePrice: "KSH 32,999",
    savings: "Save KSH 12,000",
    image: "/images/Bilstein B8 Performance Shocks.webp",
    validUntil: "2025-12-31",
    category: "Brakes & Suspension",
    partNumber: "BILSTEIN-B8-SET",
    sku: "BILSTEIN-B8-SET"
  },
  {
    id: 21,
    title: "Hella LED Daytime Running Lights",
    description: "Hella LED Daytime Running Lights with Smart Control Module",
    originalPrice: "KSH 17,999",
    salePrice: "KSH 12,999",
    savings: "Save KSH 5,000",
    image: "/images/Hella LED Daytime Running Lights.webp",
    validUntil: "2025-12-31",
    category: "Lighting",
    partNumber: "HELLA-LED-DRL",
    sku: "HELLA-LED-DRL"
  },
  {
    id: 22,
    title: "Bosch S5 Battery + Installation",
    description: "Bosch S5 Premium Car Battery with 5-Year Warranty + Installation",
    originalPrice: "KSH 12,999",
    salePrice: "KSH 8,999",
    savings: "Save KSH 4,000",
    image: "/images/Bosch S5 Battery + Installation.webp",
    validUntil: "2025-12-31",
    category: "Electrical",
    partNumber: "BOSCH-S5-PREMIUM",
    sku: "BOSCH-S5-PREMIUM"
  },
  {
    id: 23,
    title: "K&N Performance Intake System",
    description: "K&N Performance Air Intake System with Heat Shield",
    originalPrice: "KSH 39,999",
    salePrice: "KSH 29,999",
    savings: "Save KSH 10,000",
    image: "/images/K&N Performance Intake System.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "KN-INTAKE-SYSTEM",
    sku: "KN-INTAKE-SYSTEM"
  },
  {
    id: 24,
    title: "Snap-on Professional Tool Set",
    description: "Snap-on Professional 200-Piece Tool Set with Roller Cabinet",
    originalPrice: "KSH 89,999",
    salePrice: "KSH 64,999",
    savings: "Save KSH 25,000",
    image: "/images/Snap-on Professional Tool Set.webp",
    validUntil: "2025-12-31",
    category: "Tools",
    partNumber: "SNAPON-200PK-CABINET",
    sku: "SNAPON-200PK-CABINET"
  },
  {
    id: 25,
    title: "Motul 300V 5W-30 Racing Oil",
    description: "Motul 300V 5W-30 Racing Oil 4L - Professional Motorsport Grade",
    originalPrice: "KSH 15,999",
    salePrice: "KSH 11,999",
    savings: "Save KSH 4,000",
    image: "/images/Motul 300V 5W-30 Racing Oil.jpg",
    validUntil: "2025-12-31",
    category: "Engine & Filters",
    partNumber: "MOTUL-300V-5W30",
    sku: "MOTUL-300V-5W30"
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
