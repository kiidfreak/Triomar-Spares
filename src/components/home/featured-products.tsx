'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'

const featuredProducts = [
  {
    id: 1,
    name: 'Premium Brake Pads Set',
    brand: 'Brembo',
    price: '89.99',
    originalPrice: 129.99,
    rating: 4.8,
    reviewCount: 1247,
    image: '/images/products/brake-pads.jpg',
    category: 'Brakes',
    inStock: true,
    isNew: false,
    isSale: true,
    partNumber: 'BP-001',
    sku: 'SKU-001'
  },
  {
    id: 2,
    name: 'High Performance Air Filter',
    brand: 'K&N',
    price: '45.99',
    originalPrice: 45.99,
    rating: 4.9,
    reviewCount: 892,
    image: '/images/products/air-filter.jpg',
    category: 'Filters',
    inStock: true,
    isNew: true,
    isSale: false,
    partNumber: 'AF-002',
    sku: 'SKU-002'
  },
  {
    id: 3,
    name: 'LED Headlight Bulbs',
    brand: 'Philips',
    price: '67.50',
    originalPrice: 89.99,
    rating: 4.7,
    reviewCount: 1563,
    image: '/images/products/led-bulbs.jpg',
    category: 'Lighting',
    inStock: true,
    isNew: false,
    isSale: true,
    partNumber: 'LB-003',
    sku: 'SKU-003'
  },
  {
    id: 4,
    name: 'Synthetic Motor Oil 5W-30',
    brand: 'Mobil 1',
    price: '34.99',
    originalPrice: 44.99,
    rating: 4.6,
    reviewCount: 2103,
    image: '/images/products/motor-oil.jpg',
    category: 'Oil & Fluids',
    inStock: true,
    isNew: false,
    isSale: true,
    partNumber: 'MO-004',
    sku: 'SKU-004'
  }
]

export function FeaturedProducts() {
  const { addItem } = useCart()
  const [addedItem, setAddedItem] = useState<string | null>(null)
  
  // Debug: Check if component mounted and buttons exist
  useEffect(() => {
    // Component mounted
  }, [addItem])

  const handleAddToCart = (product: any) => {

    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      partNumber: product.partNumber,
      sku: product.sku
    }
          try {
        addItem(cartItem)
      } catch (error) {
        // Handle error silently in production
      }
    
    // Show success message
    setAddedItem(product.name)
    setTimeout(() => setAddedItem(null), 2000)
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
      
      <section className="section-padding">
            <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular automotive parts, carefully selected for quality, 
              performance, and customer satisfaction.
            </p>
          </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group bg-background rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.isNew && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full font-medium">
                      SALE
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    product.inStock 
                      ? 'bg-success/10 text-success' 
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-background/90 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="bg-background/90 p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {product.category}
                </span>
                
                {/* Brand */}
                <p className="text-sm text-primary font-medium mt-1">
                  {product.brand}
                </p>

                {/* Product Name */}
                <h3 className="font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium ml-1">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mt-3">
                  <span className="text-lg font-bold text-foreground">
                    KSH {product.price}
                  </span>
                  {product.originalPrice > parseFloat(product.price) && (
                    <span className="text-sm text-muted-foreground line-through">
                      KSH {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                                 <button 
                   onClick={(e) => {
                     
                     
                     // Call the original handler
                     handleAddToCart(product)
                   }}
                   className="w-full mt-4 btn-primary flex items-center justify-center space-x-2"
                 >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products CTA */}
        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="btn-outline text-lg px-8 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
    </>
  )
}
