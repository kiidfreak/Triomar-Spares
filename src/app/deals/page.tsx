'use client'

import Link from 'next/link'
import { ArrowLeft, Tag, Clock, Truck, Search, Filter } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'

const deals = [
  {
    id: "844b1711-2f63-475e-8e21-1bd4083b5860",
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
    id: "469fbe6b-50a7-481b-b59e-a7c15a8d5722",
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
    id: "ba6ec136-a389-425c-8dce-caf5c6a05f7c",
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

// Extract unique categories and brands from deals
const categories = ["All Categories", ...Array.from(new Set(deals.map(deal => deal.category)))]
const brands = ["All Brands", ...Array.from(new Set(deals.map(deal => deal.partNumber.split('-')[0])))]

export default function DealsPage() {
  const { addItem, toggleCart } = useCart()
  const [visibleDeals, setVisibleDeals] = useState(15)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [sortBy, setSortBy] = useState("featured")
  const [filteredDeals, setFilteredDeals] = useState(deals)

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

  const handleLoadMore = async () => {
    setLoading(true)
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setVisibleDeals(prev => Math.min(prev + 15, filteredDeals.length))
    setLoading(false)
  }

  // Filter and search deals
  useEffect(() => {
    let filtered = deals.filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All Categories" || deal.category === selectedCategory
      const matchesBrand = selectedBrand === "All Brands" || deal.partNumber.split('-')[0] === selectedBrand
      const dealPrice = parseFloat(deal.salePrice.replace("KSH ", "").replace(",", ""))
      const matchesPrice = dealPrice >= priceRange[0] && dealPrice <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })

    // Sort deals
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.salePrice.replace("KSH ", "").replace(",", "")) - parseFloat(b.salePrice.replace("KSH ", "").replace(",", "")))
        break
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.salePrice.replace("KSH ", "").replace(",", "")) - parseFloat(a.salePrice.replace("KSH ", "").replace(",", "")))
        break
      case "savings":
        filtered.sort((a, b) => {
          const savingsA = parseFloat(a.savings.replace("Save KSH ", "").replace(",", ""))
          const savingsB = parseFloat(b.savings.replace("Save KSH ", "").replace(",", ""))
          return savingsB - savingsA
        })
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // featured - sort by savings (highest first)
        filtered.sort((a, b) => {
          const savingsA = parseFloat(a.savings.replace("Save KSH ", "").replace(",", ""))
          const savingsB = parseFloat(b.savings.replace("Save KSH ", "").replace(",", ""))
          return savingsB - savingsA
        })
    }

    setFilteredDeals(filtered)
    setVisibleDeals(15) // Reset to first page when filters change
  }, [searchTerm, selectedCategory, selectedBrand, priceRange, sortBy])

  const hasMoreDeals = visibleDeals < filteredDeals.length

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

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Deals</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="featured">Featured (Best Savings)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="savings">Highest Savings</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Price Range - Full Width */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (KSH)</label>
            <div className="flex space-x-4 items-center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                  setSelectedBrand("All Brands")
                  setPriceRange([0, 100000])
                  setSortBy("featured")
                }}
                className="ml-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.slice(0, visibleDeals).map((deal) => (
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

        {/* Load More Button */}
        {hasMoreDeals && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-primary text-white py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More Deals</span>
                  <span className="text-sm opacity-75">({filteredDeals.length - visibleDeals} more)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-8 text-gray-600">
          <p>Showing {Math.min(visibleDeals, filteredDeals.length)} of {filteredDeals.length} deals</p>
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
