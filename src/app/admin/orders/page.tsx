'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  RefreshCw,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items_count: number
  total_amount: number
  final_amount: number
  status: string
  payment_status?: string
  payment_method?: string
  payment_transaction_id?: string
  created_at: string
  updated_at: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const { data: session, status } = useSession()

  const ordersPerPage = 20

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders()
    }
  }, [status, currentPage, statusFilter, paymentFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        limit: ordersPerPage.toString(),
        offset: ((currentPage - 1) * ordersPerPage).toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { payment_status: paymentFilter })
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data.data || [])
        setTotalPages(Math.ceil((data.total || 0) / ordersPerPage))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'payment_pending':
        return 'bg-orange-100 text-orange-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-gray-100 text-gray-800'
      case 'payment_failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusIcon = (status: string, paymentMethod?: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'payment_failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'payment_pending':
        return <Clock className="h-4 w-4 text-orange-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'mpesa':
        return <CreditCard className="h-4 w-4 text-green-600" />
      case 'card':
        return <CreditCard className="h-4 w-4 text-blue-600" />
      case 'google_pay':
        return <CreditCard className="h-4 w-4 text-purple-600" />
      default:
        return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    return `KSH ${amount.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportOrders = () => {
    if (orders.length === 0) return
    
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Phone', 'Items', 'Total Amount', 'Status', 'Payment Method', 'Payment Status', 'Date'],
      ...orders.map(order => [
        order.id,
        order.customer_name,
        order.customer_email,
        order.customer_phone,
        order.items_count.toString(),
        formatCurrency(order.total_amount),
        order.status,
        order.payment_method || 'N/A',
        order.payment_status || order.status,
        formatDate(order.created_at)
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
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
          <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Order Management</h1>
              <p className="text-lg text-gray-600">View and manage customer orders</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={fetchOrders}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button 
                onClick={exportOrders}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="payment_failed">Payment Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="google_pay">Google Pay</option>
            </select>

            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Orders ({filteredOrders.length})
            </h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.id}</div>
                          <div className="text-sm text-gray-500">{order.items_count} items</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-sm text-gray-500">{order.customer_email}</div>
                          <div className="text-sm text-gray-500">{order.customer_phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.total_amount)}</div>
                        {order.final_amount !== order.total_amount && (
                          <div className="text-sm text-gray-500">Final: {formatCurrency(order.final_amount)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getPaymentMethodIcon(order.payment_method)}
                          <div>
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {order.payment_method || 'N/A'}
                            </div>
                            {order.payment_transaction_id && (
                              <div className="text-xs text-gray-500">{order.payment_transaction_id}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getPaymentStatusIcon(order.status, order.payment_method)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-lg font-medium mb-2">No orders found</p>
              <p className="text-sm">Orders will appear here when customers make purchases</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
