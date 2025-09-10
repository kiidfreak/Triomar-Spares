'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'

interface SearchResult {
  id: string
  name: string
  partNumber: string
  sku: string
  price: string
  category: string
  image: string
  rating: number
  reviews: number
  description: string
  inStock: boolean
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchInput, setSearchInput] = useState(query)
  const { addItem } = useCart()

  // Mock search results - in real app, this would come from API
  useEffect(() => {
    setIsLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          id: '844b1711-2f63-475e-8e21-1bd4083b5860',
          name: 'Air Filter',
          partNumber: 'MAZ-CX5-AIR-001',
          sku: 'SKU-001',
          price: 'KSH 18.99',
          category: 'Engine & Filters',
          image: '/images/categories/oilfilter.avif',
          rating: 4.8,
          reviews: 156,
          description: 'High-quality air filter for Mazda CX-5',
          inStock: true
        },
        {
          id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722',
          name: 'Brake Pads',
          partNumber: 'NIS-XTRAIL-BRAKE-001',
          sku: 'SKU-002',
          price: 'KSH 42.99',
          category: 'Brakes',
          image: '/images/categories/oilfilter.avif',
          rating: 4.6,
          reviews: 89,
          description: 'Premium brake pads for Nissan X-Trail',
          inStock: true
        },
        {
          id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c',
          name: 'Engine Oil Filter',
          partNumber: 'TOY-PRADO-OIL-001',
          sku: 'SKU-003',
          price: 'KSH 14.99',
          category: 'Engine & Filters',
          image: '/images/categories/oilfilter.avif',
          rating: 4.9,
          reviews: 189,
          description: 'Engine oil filter for Toyota Prado',
          inStock: true
        },
        {
          id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b',
          name: 'Bosch S4 Car Battery',
          partNumber: 'BOSCH-S4-001',
          sku: 'SKU-004',
          price: 'KSH 5,999.00',
          category: 'Engine & Filters',
          image: '/images/categories/oilfilter.avif',
          rating: 4.6,
          reviews: 98,
          description: 'Professional grade oil filter for commercial use',
          inStock: false
        }
      ]
      
      // Filter results based on query
      const filtered = mockResults.filter(result => 
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.partNumber.toLowerCase().includes(query.toLowerCase()) ||
        result.category.toLowerCase().includes(query.toLowerCase())
      )
      
      setSearchResults(filtered)
      setIsLoading(false)
    }, 500)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const addToCart = (product: SearchResult) => {
    if (!product.inStock) return
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      partNumber: product.partNumber,
      sku: product.sku
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for "{query}"...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-lg text-gray-600">
            Found {searchResults.length} results
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchInput)}
                placeholder="Search for parts..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                onClick={() => handleSearch(searchInput)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search terms or browse our categories</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/categories/engine-filters" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Engine & Filters
              </Link>
              <Link href="/categories/brakes-suspension" className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors">
                Brakes & Suspension
              </Link>
              <Link href="/categories/electrical" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Electrical
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                  <Image
                    src={result.image}
                    alt={result.name}
                    fill
                    className="object-cover"
                  />
                  {!result.inStock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary font-medium">{result.category}</span>
                    <span className="text-xs text-gray-500">SKU: {result.sku}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{result.name}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{result.description}</p>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(result.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({result.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{result.price}</span>
                    <button
                      onClick={() => addToCart(result)}
                      disabled={!result.inStock}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
