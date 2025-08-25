'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import AddProductForm from '@/components/admin/add-product-form'
import AdminSettings from '@/components/admin/admin-settings'
import { 
  ArrowLeft, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  X,
  Save
} from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items_count: number
  total_amount: number
  status: string
  created_at: string
}

interface Product {
  id: number
  name: string
  part_number?: string
  description?: string
  category_name: string
  vehicle_name?: string
  brand: string
  sales_count: number
  revenue: number
  stock_quantity: number
  price: number
  warranty_months?: number
  is_active?: boolean
  image_url?: string
}

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [topProducts, setTopProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, refreshTrigger])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData.data)
      }

      // Fetch recent orders
      const ordersResponse = await fetch('/api/admin/orders?limit=5')
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.data)
      }

      // Fetch top products
      const productsResponse = await fetch('/api/admin/products?limit=5')
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setTopProducts(productsData.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'payment_failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatCurrency = (amount: number) => {
    return `KSH ${amount.toLocaleString()}`
  }

  const handleViewProduct = (productId: number) => {
    router.push(`/products/${productId}`)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setImageFile(null)
    setImagePreview('')
  }

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      // First, upload image if there's a new one
      let imageUrl = updatedProduct.image_url
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        
        const uploadResponse = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        }
      }

      // Then update the product
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedProduct.name,
          part_number: updatedProduct.part_number || '',
          description: updatedProduct.description || '',
          category_name: updatedProduct.category_name,
          vehicle_name: updatedProduct.vehicle_name || '',
          brand: updatedProduct.brand || '',
          price: updatedProduct.price,
          stock_quantity: updatedProduct.stock_quantity,
          warranty_months: updatedProduct.warranty_months || 0,
          is_active: updatedProduct.is_active !== undefined ? updatedProduct.is_active : true,
          image_url: imageUrl
        })
      })

      if (response.ok) {
        setTopProducts(topProducts.map(p => p.id === updatedProduct.id ? { ...updatedProduct, image_url: imageUrl } : p))
        setEditingProduct(null)
        setImageFile(null)
        setImagePreview('')
        setRefreshTrigger(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }

  const handleDeleteProduct = async (productId: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setTopProducts(topProducts.filter(p => p.id !== productId))
          setRefreshTrigger(prev => prev + 1)
        }
      } catch (error) {
        console.error('Error deleting product:', error)
      }
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, image_url: undefined })
    }
  }

  const exportCustomerData = () => {
    if (recentOrders.length === 0) return
    
    const csvContent = [
      ['Customer Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order'],
      ...recentOrders.map(order => [
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.items_count.toString(),
        formatCurrency(order.total_amount),
        new Date(order.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportSalesReport = () => {
    if (recentOrders.length === 0) return
    
    const csvContent = [
      ['Order ID', 'Customer', 'Items', 'Total Amount', 'Status', 'Date'],
      ...recentOrders.map(order => [
        order.id,
        order.customer_name,
        order.items_count.toString(),
        formatCurrency(order.total_amount),
        order.status,
        new Date(order.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sales-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportInventoryReport = () => {
    if (topProducts.length === 0) return
    
    const csvContent = [
      ['Product Name', 'Category', 'Brand', 'Stock', 'Price', 'Sales Count', 'Revenue'],
      ...topProducts.map(product => [
        product.name,
        product.category_name,
        product.brand || 'N/A',
        product.stock_quantity.toString(),
        formatCurrency(product.price),
        product.sales_count.toString(),
        formatCurrency(product.revenue)
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'inventory-report.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportCustomerReport = () => {
    exportCustomerData() // Reuse existing function
  }

  const exportAnalyticsSummary = () => {
    const csvContent = [
      ['Metric', 'Value'],
      ['Total Orders', stats.totalOrders.toString()],
      ['Total Revenue', formatCurrency(stats.totalRevenue)],
      ['Total Customers', stats.totalCustomers.toString()],
      ['Total Products', stats.totalProducts.toString()],
      ['Average Order Value', stats.totalOrders > 0 ? formatCurrency(Math.round(stats.totalRevenue / stats.totalOrders)) : 'KSH 0'],
      ['Export Date', new Date().toLocaleDateString()]
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'analytics-summary.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need to be logged in to access the admin dashboard.</p>
          <Link href="/" className="text-primary hover:text-primary/80">
            Return to Home
          </Link>
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
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-lg text-gray-600">Manage your AutoZone store</p>
            </div>
            <div className="flex items-center space-x-3">
              <Link 
                href="/admin/products"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Manage Products</span>
              </Link>
              <button 
                onClick={() => setShowAddProduct(true)}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
              <button 
                onClick={() => setShowSettings(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-8 shadow-sm">
          {['overview', 'products', 'orders', 'customers', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <Users className="h-6 w-6 text-primary" />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <Link href="/admin/products" className="p-3 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors">
                    <Package className="h-6 w-6 text-primary" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Orders and Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <p className="text-sm text-gray-600">Latest customer orders</p>
                </div>
                <div className="p-6">
                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{order.id}</h4>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{order.customer_name}</p>
                            <p className="text-xs text-gray-500">{order.customer_email} • {order.customer_phone}</p>
                            <p className="text-xs text-gray-500">{order.items_count} items • {formatCurrency(order.total_amount)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => router.push(`/orders/${order.id}`)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="View Order"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Edit Order"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No orders yet</p>
                    </div>
                  )}
                  <div className="mt-6 text-center">
                    <Link href="/admin/orders" className="text-primary hover:text-primary/80 text-sm font-medium">
                      View all orders →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <p className="text-sm text-gray-600">Best selling products this month</p>
                </div>
                <div className="p-6">
                  {topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {topProducts.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.category_name}</p>
                            <p className="text-xs text-gray-500">{product.sales_count} sold • {formatCurrency(product.revenue)}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 
                              product.stock_quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock_quantity} in stock
                            </span>
                            <button 
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No products yet</p>
                    </div>
                  )}
                  <div className="mt-6 text-center">
                    <Link href="/admin/products" className="text-primary hover:text-primary/80 text-sm font-medium">
                      View all products →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Products Management</h3>
                  <p className="text-sm text-gray-600">Manage your product catalog</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  </div>
                  <Link 
                    href="/admin/products"
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View All Products</span>
                  </Link>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {topProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">ID: {product.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.brand || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sales_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.stock_quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 
                              product.stock_quantity > 5 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock_quantity > 10 ? 'In Stock' : product.stock_quantity > 5 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleViewProduct(product.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Product"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit Product"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete Product"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No products yet</p>
                  <p className="text-sm mb-4">Get started by adding your first product</p>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Add First Product
                  </button>
                </div>
              )}
              <div className="mt-6 text-center">
                <Link href="/admin/products" className="text-primary hover:text-primary/80 text-sm font-medium">
                  View all products →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
                  <p className="text-sm text-gray-600">Track and manage customer orders</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-sm text-gray-500">{order.customer_email}</div>
                              <div className="text-sm text-gray-500">{order.customer_phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items_count} items</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Order"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit Order"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => router.push(`/admin/orders/${order.id}/settings`)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Order Settings"
                              >
                                <Settings className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No orders yet</p>
                  <p className="text-sm">Orders will appear here when customers make purchases</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Management</h3>
                  <p className="text-sm text-gray-600">Manage customer accounts and data</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                    />
                  </div>
                  <button 
                    onClick={() => exportCustomerData()}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items_count}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => router.push(`/orders/${order.id}`)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="View Orders"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                className="text-green-600 hover:text-green-900"
                                title="Edit Customer"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No customers yet</p>
                  <p className="text-sm">Customer data will appear here when orders are placed</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Sales Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stats.totalOrders}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.totalOrders > 0 ? formatCurrency(Math.round(stats.totalRevenue / stats.totalOrders)) : 'KSH 0'}
                  </div>
                  <div className="text-sm text-gray-600">Average Order Value</div>
                </div>
              </div>
            </div>

            {/* Top Categories Performance */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories Performance</h3>
              <div className="space-y-4">
                {Object.values(topProducts.reduce((acc, product) => {
                  const category = product.category_name
                  if (!acc[category]) {
                    acc[category] = { name: category, revenue: 0, sales: 0, products: 0 }
                  }
                  acc[category].revenue += product.revenue
                  acc[category].sales += product.sales_count
                  acc[category].products += 1
                  return acc
                }, {} as Record<string, { name: string, revenue: number, sales: number, products: number }>))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5)
                .map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{category.products} products</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(category.revenue)}</p>
                      <p className="text-sm text-gray-500">{category.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order, index) => (
                  <div key={order.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{order.customer_name}</span> placed an order for {formatCurrency(order.total_amount)}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                ))}
                {topProducts.slice(0, 3).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{product.name}</span> stock updated to {product.stock_quantity} units
                      </p>
                      <p className="text-xs text-gray-500">Product management</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => exportSalesReport()}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Sales Report (CSV)</span>
                </button>
                <button 
                  onClick={() => exportInventoryReport()}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Inventory Report (CSV)</span>
                </button>
                <button 
                  onClick={() => exportCustomerReport()}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Customer Report (CSV)</span>
                </button>
                <button 
                  onClick={() => exportAnalyticsSummary()}
                  className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Analytics Summary (CSV)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {showAddProduct && (
          <AddProductForm
            onClose={() => setShowAddProduct(false)}
            onSuccess={() => {
              setShowAddProduct(false)
              setRefreshTrigger(prev => prev + 1)
            }}
          />
        )}

        {showSettings && (
          <AdminSettings
            onClose={() => setShowSettings(false)}
          />
        )}

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Product</h3>
                <button 
                  onClick={() => setEditingProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                    <input
                      type="text"
                      value={editingProduct.part_number || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, part_number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                {/* Product Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="space-y-4">
                    {/* Current Image Display */}
                    {(editingProduct.image_url || imagePreview) && (
                      <div className="relative">
                        <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={imagePreview || editingProduct.image_url}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Image Upload */}
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md border border-gray-300 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {editingProduct.image_url || imagePreview ? 'Change Image' : 'Upload Image'}
                        </span>
                      </label>
                      {!editingProduct.image_url && !imagePreview && (
                        <span className="text-sm text-gray-500">No image selected</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category_name}
                      onChange={(e) => setEditingProduct({...editingProduct, category_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                    <input
                      type="text"
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KSH)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editingProduct.stock_quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Warranty (months)</label>
                    <input
                      type="number"
                      value={editingProduct.warranty_months || 0}
                      onChange={(e) => setEditingProduct({...editingProduct, warranty_months: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingProduct.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditingProduct({...editingProduct, is_active: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setImageFile(null)
                    setImagePreview('')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveProduct(editingProduct)}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
