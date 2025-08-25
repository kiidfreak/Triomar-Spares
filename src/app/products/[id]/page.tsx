'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, ShoppingCart, Star, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  part_number?: string
  description?: string
  price: number
  brand?: string
  category_name: string
  vehicle_name?: string
  stock_quantity: number
  warranty_months?: number
  image_url?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, toggleCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.data)
      } else {
        console.error('Failed to fetch product')
        router.push('/products')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/images/placeholder.svg',
        quantity: quantity
      })
      toast.success('Product added to cart!')
      toggleCart()
    }
  }

  const formatCurrency = (amount: number) => {
    return `KSH ${amount.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="text-primary hover:text-primary/80">
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              {product.part_number && (
                <p className="text-gray-600 mb-2">Part #: {product.part_number}</p>
              )}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.5)</span>
                </div>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(product.price)}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Category: {product.category_name}</span>
                {product.brand && <span>Brand: {product.brand}</span>}
              </div>
              {product.vehicle_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Compatible with: {product.vehicle_name}
                </p>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className={`ml-2 font-medium ${
                    product.stock_quantity > 10 ? 'text-green-600' :
                    product.stock_quantity > 5 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {product.stock_quantity} available
                  </span>
                </div>
                {product.warranty_months && (
                  <div>
                    <span className="text-gray-600">Warranty:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {product.warranty_months} months
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>
                  {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
