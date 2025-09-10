'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-context'
import { useCart } from '@/components/cart/cart-context'
import { Heart, Trash2, ShoppingCart, Eye, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock wishlist data - in a real app, this would come from an API
const mockWishlist = [
  {
    id: '1',
    name: 'Premium Brake Pads Set',
    brand: 'Brembo',
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 1247,
    image: '/images/products/brake-pads.jpg',
    category: 'Brakes',
    inStock: true,
    partNumber: 'BP-001',
    sku: 'SKU-001'
  },
  {
    id: '2',
    name: 'High Performance Air Filter',
    brand: 'K&N',
    price: 45.99,
    originalPrice: 45.99,
    rating: 4.9,
    reviewCount: 892,
    image: '/images/products/air-filter.jpg',
    category: 'Filters',
    inStock: true,
    partNumber: 'AF-002',
    sku: 'SKU-002'
  },
  {
    id: '3',
    name: 'LED Headlight Bulbs',
    brand: 'Philips',
    price: 67.50,
    originalPrice: 89.99,
    rating: 4.7,
    reviewCount: 1563,
    image: '/images/products/led-bulbs.jpg',
    category: 'Lighting',
    inStock: true,
    partNumber: 'LB-003',
    sku: 'SKU-003'
  }
]

export default function WishlistPage() {
  const { state } = useAuth()
  const { addItem } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  
  // Debug: Check if component mounted and buttons exist
  useEffect(() => {
    console.log('=== WISHLIST COMPONENT MOUNTED ===')
    console.log('addItem function available:', !!addItem)
    console.log('addItem function type:', typeof addItem)
    
    // Check if buttons exist in DOM
    setTimeout(() => {
      const buttons = document.querySelectorAll('button')
      console.log('Total buttons found in DOM:', buttons.length)
      
      const addToCartButtons = document.querySelectorAll('button[onclick*="addItem"]')
      console.log('Add to cart buttons found:', addToCartButtons.length)
      
      addToCartButtons.forEach((button, index) => {
        console.log(`Button ${index}:`, button)
        console.log(`Button text:`, button.textContent)
        console.log(`Button classes:`, button.className)
      })
    }, 1000)
  }, [addItem])

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view your wishlist</h1>
          <Link href="/login" className="text-primary hover:underline">
            Go to login page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Success Notification */}
      {addedItem && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right-2">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>{addedItem} added to cart!</span>
          </div>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">Your saved items and favorites</p>
            </div>
            <Link
              href="/account"
              className="btn-outline flex items-center"
            >
              <Heart className="h-4 w-4 mr-2" />
              Back to Account
            </Link>
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-6">
          {mockWishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">Start adding items to your wishlist while shopping</p>
              <Link href="/" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockWishlist.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/90 p-2 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="bg-white/90 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Stock Status */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category */}
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    
                    {/* Brand */}
                    <p className="text-sm text-primary font-medium mt-1">
                      {item.brand}
                    </p>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium ml-1">{item.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({item.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-lg font-bold text-gray-900">
                        KSH {item.price}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through">
                          KSH {item.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-4">
                                             <button 
                                          onClick={(e) => {
                    console.log('=== BUTTON CLICK EVENT (WISHLIST) ===')
                    console.log('Event object:', e)
                    console.log('Event target:', e.target)
                    console.log('Event currentTarget:', e.currentTarget)
                    console.log('Button clicked for item:', item)
                    
                    console.log('=== WISHLIST ADD TO CART DEBUG ===')
                    console.log('Item to add:', item)
                    console.log('addItem function:', addItem)
                    
                    const cartItem = {
                      id: item.id, // Already a string UUID
                      name: item.name,
                      price: item.price.toString(),
                      image: item.image,
                      partNumber: item.partNumber || 'N/A',
                      sku: item.sku || 'N/A'
                    }
                    console.log('Cart item to add:', cartItem)
                    
                    try {
                      addItem(cartItem)
                      console.log('addItem called successfully from wishlist')
                    } catch (error) {
                      console.error('Error calling addItem from wishlist:', error)
                    }
                    
                    setAddedItem(item.name)
                    setTimeout(() => setAddedItem(null), 2000)
                  }}
                         className="flex-1 btn-primary flex items-center justify-center space-x-2"
                       >
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        <Trash2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State CTA */}
        {mockWishlist.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <Link href="/" className="btn-outline">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
