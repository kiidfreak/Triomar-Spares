import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Filter, Search, Star, Truck, MapPin, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nissan X-Trail T30 Parts & Accessories | Triomah Spares Ltd',
  description: 'Quality spare parts for Nissan X-Trail T30. Engine parts, filters, brakes, suspension, electrical components, and more. Expert support and fast delivery.',
}

const productCategories = [
  {
    id: 'engine-filters',
    name: 'Engine & Filters',
    icon: '🔧',
    products: [
      {
        id: 1,
        name: 'STP Extended Life Spin-On Engine Oil Filter S6607XL',
        partNumber: 'S6607XL',
        sku: '663653',
        price: '£9.99',
        notes: 'Engine Oil Filter',
        image: '/images/2s-stp-1-d.webp',
        rating: 4.8,
        reviews: 156,
        delivery: 'Standard Delivery by Aug. 25'
      },
      {
        id: 2,
        name: 'STP Spin-On Engine Oil Filter S6607',
        partNumber: 'S6607',
        sku: '61887',
        price: '£5.99',
        notes: 'Engine Oil Filter',
        image: '/images/2s-stp-2-d.webp',
        rating: 4.6,
        reviews: 89,
        delivery: 'Standard Delivery by Aug. 25'
      },
      {
        id: 3,
        name: 'STP Rectangular Engine Air Filter SA12167',
        partNumber: 'SA12167',
        sku: '737934',
        price: '£21.99',
        notes: 'Engine Air Filter',
        image: '/images/product-1-d.webp',
        rating: 4.5,
        reviews: 203,
        delivery: 'Standard Delivery by Aug. 25'
      }
    ]
  },
  {
    id: 'brakes-suspension',
    name: 'Brakes & Suspension',
    icon: '🛑',
    products: [
      {
        id: 4,
        name: 'Duralast Brake Pads (Front)',
        partNumber: 'DB1234',
        sku: '123456',
        price: '£45.99',
        notes: 'Front Brake Pads',
        image: '/images/brake-pads-v2-d.jpeg',
        rating: 4.7,
        reviews: 78,
        delivery: 'Standard Delivery by Aug. 25'
      },
      {
        id: 5,
        name: 'Duralast Brake Discs (Front)',
        partNumber: 'DB5678',
        sku: '234567',
        price: '£89.99',
        notes: 'Front Brake Discs',
        image: '/images/brake-pads-v2-e.jpeg',
        rating: 4.6,
        reviews: 45,
        delivery: 'Standard Delivery by Aug. 25'
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: '⚡',
    products: [
      {
        id: 6,
        name: 'Duralast Battery 24F',
        partNumber: '24F-DL',
        sku: '789012',
        price: '£89.99',
        notes: 'Car Battery',
        image: '/images/fullbattery.jpeg',
        rating: 4.9,
        reviews: 234,
        delivery: 'Standard Delivery by Aug. 25'
      },
      {
        id: 7,
        name: 'Duralast Ignition Coil',
        partNumber: 'IC789',
        sku: '345678',
        price: '£34.99',
        notes: 'Ignition Coil',
        image: '/images/enginelighton.webp',
        rating: 4.8,
        reviews: 167,
        delivery: 'Standard Delivery by Aug. 25'
      }
    ]
  }
]

const recommendedProducts = [
  {
    id: 1,
    name: 'STP Max Cabin Air Filter CAF1907M',
    price: '£31.49',
    rating: 5.0,
    reviews: 12,
    image: '/images/product-2-d.webp'
  },
  {
    id: 2,
    name: 'STP Cabin Air Filter CAF1907P',
    price: '£23.99',
    rating: 4.9,
    reviews: 97,
    image: '/images/product-3-d.webp'
  },
  {
    id: 3,
    name: 'Duralast 14in Wiper Blade',
    price: '£13.99',
    rating: 4.3,
    reviews: 110,
    image: '/images/product-1-d.webp'
  }
]

export default function NissanXTrailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/vehicles" className="inline-flex items-center text-gray-600 hover:text-primary">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Vehicles
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nissan X-Trail T30</h1>
                <p className="text-sm text-gray-600">2014-2018 Nissan X-Trail T30 2.0L DI DOHC 4cyl</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/contact" className="text-primary hover:text-primary/80">
                <MapPin className="h-5 w-5 mr-2 inline" />
                Find Store
              </Link>
              <Link href="tel:+447349013628" className="text-primary hover:text-primary/80">
                <Phone className="h-5 w-5 mr-2 inline" />
                +44 7349 013628
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Selection Banner */}
      <div className="bg-primary text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Currently Shopping For:</span>
              <span className="text-sm">2014-2018 Nissan X-Trail T30 2.0L DI DOHC 4cyl</span>
            </div>
            <Link href="/vehicles" className="text-sm underline hover:no-underline">
              Change Vehicle
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Shop by Category</h3>
              <div className="space-y-2">
                {productCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`#${category.id}`}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-gray-500">({category.products.length})</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for parts..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="h-5 w-5" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Product Categories */}
            {productCategories.map((category) => (
              <div key={category.id} id={category.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-2xl font-bold">{category.name}</h2>
                  <span className="text-gray-500">({category.products.length} products)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                        <span className="text-4xl">🔧</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Part #:</span> {product.partNumber}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">SKU #:</span> {product.sku}
                      </div>
                      {product.notes && (
                        <div className="text-sm text-gray-600 mb-3 italic">{product.notes}</div>
                      )}
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">{product.price}</div>
                      <div className="text-sm text-gray-600 mb-4">{product.delivery}</div>
                      <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Recommended Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-6">Recommended For Your Nissan X-Trail T30</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                      <span className="text-4xl">🔧</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="text-xl font-bold text-primary mb-4">{product.price}</div>
                    <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Finding the Right Part?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our experts can help you find the perfect parts for your Nissan X-Trail T30
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </Link>
            <Link href="tel:+447349013628" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors">
              Call Now: +44 7349 013628
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
