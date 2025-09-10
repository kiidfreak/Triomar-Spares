'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Truck, Package, Clock } from 'lucide-react'
import { useCart } from '@/components/cart/cart-context'
import toast from 'react-hot-toast'

// Mock category data - in real app this would come from Supabase
const categories = {
  'mazda-cx5': {
    name: 'Mazda CX-5 Parts',
    description: 'High-quality spare parts for Mazda CX-5 models',
    image: '/images/categories/accessories.jpg',
    parts: [
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Engine Oil Filter', price: 'KSH 1,799', image: '/images/categories/oilfilter.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Air Filter', price: 'KSH 1,299', image: '/images/categories/airfilter.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Brake Pads (Front)', price: 'KSH 3,499', image: '/images/categories/duralastbrakepads.avif' },
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Brake Pads (Rear)', price: 'KSH 2,899', image: '/images/categories/duralastbrakepads.avif' },
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Shock Absorbers', price: 'KSH 12,999', image: '/images/categories/shockabsorber.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Control Arms', price: 'KSH 6,599', image: '/images/categories/controlarm.avif' }
    ]
  },
  'nissan-xtrail': {
    name: 'Nissan X-Trail T30 Parts',
    description: 'Reliable spare parts for Nissan X-Trail T30 models',
    image: '/images/categories/accessories.jpg',
    parts: [
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Engine Oil Filter', price: 'KSH 1,699', image: '/images/categories/oilfilter.avif' },
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Fuel Pump', price: 'KSH 18,999', image: '/images/categories/fuelfilter.avif' },
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Brake Discs', price: 'KSH 4,999', image: '/images/categories/brakerotor.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Suspension Bushes', price: 'KSH 2,299', image: '/images/categories/controlarm.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Ignition Coils', price: 'KSH 4,199', image: '/images/categories/alternator.avif' }
    ]
  },
  'toyota-prado': {
    name: 'Toyota Prado Parts',
    description: 'Premium spare parts for Toyota Prado models',
    image: '/images/categories/accessories.jpg',
    parts: [
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Timing Belt', price: 'KSH 12,999', image: '/images/categories/oilfilter.avif' },
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Water Pump', price: 'KSH 9,799', image: '/images/categories/fuelfilter.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Suspension Arms', price: 'KSH 7,599', image: '/images/categories/controlarm.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Ball Joints', price: 'KSH 3,399', image: '/images/categories/controlarm.avif' }
    ]
  },
  'engine-filters': {
    name: 'Engine & Filters',
    description: 'Complete range of engine filters and maintenance parts',
    image: '/images/categories/filters.jpg',
    parts: [
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'STP Oil Filter Bundle', price: 'KSH 4,999', image: '/images/categories/oilfilter.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Air Filter', price: 'KSH 1,299', image: '/images/categories/airfilter.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Fuel Filter', price: 'KSH 1,899', image: '/images/categories/fuelfilter.avif' },
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Cabin Air Filter', price: 'KSH 1,499', image: '/images/categories/cabinairfilter.avif' }
    ]
  },
  'brakes-suspension': {
    name: 'Brakes & Suspension',
    description: 'Quality brake and suspension components',
    image: '/images/categories/freepadsbanner.webp',
    parts: [
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Duralast Brake Pads', price: 'KSH 3,499', image: '/images/categories/duralastbrakepads.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Brake Rotors', price: 'KSH 4,999', image: '/images/categories/brakerotor.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Shock Absorbers', price: 'KSH 12,999', image: '/images/categories/shockabsorber.avif' },
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Control Arms', price: 'KSH 6,599', image: '/images/categories/controlarm.avif' }
    ]
  },
  'electrical': {
    name: 'Electrical Components',
    description: 'Electrical parts and accessories',
    image: '/images/categories/lighting.jpg',
    parts: [
      { id: '943f4c91-cd8b-4acd-a578-95d47a1e3d8b', name: 'Car Battery', price: 'KSH 12,999', image: '/images/categories/battery.avif' },
      { id: '844b1711-2f63-475e-8e21-1bd4083b5860', name: 'Alternator', price: 'KSH 18,999', image: '/images/categories/alternator.avif' },
      { id: '469fbe6b-50a7-481b-b59e-a7c15a8d5722', name: 'Starter Motor', price: 'KSH 12,999', image: '/images/categories/startermotor.avif' },
      { id: 'ba6ec136-a389-425c-8dce-caf5c6a05f7c', name: 'Headlight Bulbs', price: 'KSH 1,899', image: '/images/categories/headlightbulb.avif' }
    ]
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories[params.slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const { addItem } = useCart()

  const handleAddToCart = (part: any) => {
    addItem({
      id: part.id,
      name: part.name,
      price: part.price,
      image: part.image,
      partNumber: `CAT-${part.id}`,
      sku: `SKU-${part.id}`,
    })
    toast.success(`${part.name} added to cart!`)
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{category.name}</h1>
          <p className="text-lg text-gray-600">{category.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {category.parts.map((part) => (
            <div key={part.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                                 <Image
                   src={part.image}
                   alt={part.name}
                   fill
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                   className="object-cover"
                 />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{part.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{part.price}</span>
                  <button
                    onClick={() => handleAddToCart(part)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
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
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                              <p className="text-gray-600">Free delivery on orders over KSH 10,000</p>
            </div>
            <div className="flex flex-col items-center">
              <Package className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Parts</h3>
              <p className="text-gray-600">Genuine and aftermarket parts</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">Professional advice and support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
