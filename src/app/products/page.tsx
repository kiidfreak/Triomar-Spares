'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Filter, Grid, List, Star, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'

// Sample products data - in a real app, this would come from your database
const allProducts = [
  // Engine & Filters
  {
    id: 1,
    name: "STP Extended Life Oil Filter",
    price: "KSH 1,299",
    originalPrice: "KSH 1,599",
    image: "/images/oilfilterdeals.jpeg",
    category: "Engine & Filters",
    brand: "STP",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isDeal: false,
    description: "High-quality oil filter for extended service intervals"
  },
  {
    id: 2,
    name: "K&N Performance Air Filter",
    price: "KSH 3,499",
    originalPrice: "KSH 4,999",
    image: "/images/K&N Air Filter + Cleaner Kit.jpg",
    category: "Engine & Filters",
    brand: "K&N",
    rating: 4.8,
    reviews: 89,
    inStock: true,
    isDeal: true,
    description: "Performance air filter with cleaning and oiling kit"
  },
  {
    id: 3,
    name: "Mobil 1 Synthetic Oil 5L",
    price: "KSH 3,999",
    originalPrice: "KSH 5,499",
    image: "/images/oilfilterdeals.jpeg",
    category: "Engine & Filters",
    brand: "Mobil",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    isDeal: true,
    description: "5L Mobil 1 Synthetic Oil + Premium Oil Filter"
  },
  // Brakes & Suspension
  {
    id: 4,
    name: "Brembo Premium Brake Pads",
    price: "KSH 6,499",
    originalPrice: "KSH 8,999",
    image: "/images/Brembo Sport Brake Discs & Pads.jpg",
    category: "Brakes & Suspension",
    brand: "Brembo",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    isDeal: true,
    description: "Front & Rear Brembo Premium Brake Pads for most vehicles"
  },
  {
    id: 5,
    name: "Monroe Shock Absorbers",
    price: "KSH 8,999",
    originalPrice: "KSH 12,999",
    image: "/images/Monroe Shock Absorbers Set.JPG",
    category: "Brakes & Suspension",
    brand: "Monroe",
    rating: 4.4,
    reviews: 67,
    inStock: true,
    isDeal: true,
    description: "Monroe Reflex Shock Absorbers - Front or Rear Set"
  },
  // Electrical
  {
    id: 6,
    name: "Bosch S4 Car Battery",
    price: "KSH 5,999",
    originalPrice: "KSH 7,999",
    image: "/images/Bosch S5 Battery + Installation.webp",
    category: "Electrical",
    brand: "Bosch",
    rating: 4.5,
    reviews: 142,
    inStock: true,
    isDeal: true,
    description: "Bosch S4 Car Battery with free installation service"
  },
  // Lighting
  {
    id: 7,
    name: "Philips LED Headlight Bulbs",
    price: "KSH 2,499",
    originalPrice: "KSH 3,499",
    image: "/images/Philips LED Headlight Bulbs Pair.jpg",
    category: "Lighting",
    brand: "Philips",
    rating: 4.6,
    reviews: 98,
    inStock: true,
    isDeal: true,
    description: "Philips X-tremeVision LED Headlight Bulbs - Brighter than standard"
  },
  // Tools
  {
    id: 8,
    name: "Halfords Advanced Tool Kit",
    price: "KSH 9,999",
    originalPrice: "KSH 14,999",
    image: "/images/Halfords Advanced Tool Kit.webp",
    category: "Tools",
    brand: "Halfords",
    rating: 4.8,
    reviews: 76,
    inStock: true,
    isDeal: true,
    description: "Halfords Advanced 150-Piece Tool Kit with carry case"
  },
  // Add more products as needed...
]

const categories = [
  "All Categories",
  "Engine & Filters",
  "Brakes & Suspension", 
  "Electrical",
  "Lighting",
  "Tools",
  "Accessories",
  "Oils & Fluids"
]

const brands = [
  "All Brands",
  "STP",
  "K&N",
  "Mobil",
  "Brembo",
  "Monroe",
  "Bosch",
  "Philips",
  "Halfords"
]

export default function ProductsPage() {
  const { addItem, toggleCart } = useCart()
  const [products, setProducts] = useState(allProducts)
  const [filteredProducts, setFilteredProducts] = useState(allProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedBrand, setSelectedBrand] = useState("All Brands")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(12)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          if (data.products && data.products.length > 0) {
            setProducts(data.products)
            setFilteredProducts(data.products)
          }
        }
      } catch (err) {
        // If fetch fails, we keep the static sample data as fallback
        console.error('Failed to fetch products from API:', err)
      }
    }

    fetchProducts()
  }, [])

  // Filter and search products
  useEffect(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
      const matchesBrand = selectedBrand === "All Brands" || product.brand === selectedBrand
      const matchesPrice = parseFloat(product.price.replace("KSH ", "").replace(",", "")) >= priceRange[0] &&
                          parseFloat(product.price.replace("KSH ", "").replace(",", "")) <= priceRange[1]
      
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => parseFloat(a.price.replace("KSH ", "").replace(",", "")) - parseFloat(b.price.replace("KSH ", "").replace(",", "")))
        break
      case "price-high":
        filtered.sort((a, b) => parseFloat(b.price.replace("KSH ", "").replace(",", "")) - parseFloat(a.price.replace("KSH ", "").replace(",", "")))
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      default:
        // featured - deals first, then by rating
        filtered.sort((a, b) => {
          if (a.isDeal && !b.isDeal) return -1
          if (!a.isDeal && b.isDeal) return 1
          return b.rating - a.rating
        })
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, searchTerm, selectedCategory, selectedBrand, priceRange, sortBy])

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const handleAddToCart = (product: any) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      partNumber: `PN-${product.id}`,
      sku: `SKU-${product.id}`
    }
    
    addItem(cartItem)
    toast.success(`${product.name} added to cart!`)
    toggleCart()
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-lg text-gray-600">Browse our complete collection of automotive parts and accessories</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
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
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                className="w-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              />
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                  setSelectedBrand("All Brands")
                  setPriceRange([0, 50000])
                  setSortBy("featured")
                }}
                className="ml-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-600">
                Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md ${viewMode === "grid" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md ${viewMode === "list" ? "bg-primary text-white" : "bg-gray-200 text-gray-600"}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {currentProducts.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {currentProducts.map((product) => (
                <div key={product.id} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                  <div className={`relative ${viewMode === "list" ? "w-48 h-32" : "aspect-video"} bg-gray-200 overflow-hidden`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes={viewMode === "list" ? "192px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                      className="object-cover"
                    />
                    {product.isDeal && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        DEAL
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm text-primary font-medium">{product.category}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">{product.price}</span>
                        {product.originalPrice !== product.price && (
                          <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">{product.brand}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All Categories")
                  setSelectedBrand("All Brands")
                  setPriceRange([0, 50000])
                  setSortBy("featured")
                }}
                className="mt-4 text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md ${
                      currentPage === page
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
