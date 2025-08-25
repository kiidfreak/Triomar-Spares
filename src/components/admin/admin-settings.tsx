'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  Users, 
  Store, 
  Bell, 
  Shield, 
  Database, 
  Download,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Loader2,
  Package,
  ShoppingCart
} from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'manager' | 'viewer'
  first_name?: string
  last_name?: string
  created_at: string
}

interface StoreSettings {
  store_name: string
  store_email: string
  store_phone: string
  store_address: string
  currency: string
  tax_rate: number
  shipping_cost: number
  free_shipping_threshold: number
  low_stock_threshold: number
  auto_order_enabled: boolean
}

interface NotificationSettings {
  low_stock_alerts: boolean
  new_order_notifications: boolean
  customer_registration_alerts: boolean
  system_maintenance_alerts: boolean
  email_notifications: boolean
  sms_notifications: boolean
}

export default function AdminSettings({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('users')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Admin Users State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'manager' | 'viewer'>('manager')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    store_name: 'AutoZone',
            store_email: 'your-email@yourdomain.com',
    store_phone: '+254 700 000 000',
    store_address: 'Nairobi, Kenya',
    currency: 'KSH',
    tax_rate: 16,
    shipping_cost: 500,
    free_shipping_threshold: 5000,
    low_stock_threshold: 5,
    auto_order_enabled: false
  })
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    low_stock_alerts: true,
    new_order_notifications: true,
    customer_registration_alerts: false,
    system_maintenance_alerts: true,
    email_notifications: true,
    sms_notifications: false
  })

  useEffect(() => {
    fetchAdminUsers()
    fetchStoreSettings()
  }, [])

  const fetchAdminUsers = async () => {
    try {
      // In a real app, you'd have an admin_users table
      // For now, we'll simulate with sample data
      const sampleUsers: AdminUser[] = [
        {
          id: '1',
          email: 'your-email@yourdomain.com',
          role: 'admin',
          first_name: 'John',
          last_name: 'Admin',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          email: 'manager@autozone.com',
          role: 'manager',
          first_name: 'Sarah',
          last_name: 'Manager',
          created_at: '2024-01-15'
        }
      ]
      setAdminUsers(sampleUsers)
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }

  const fetchStoreSettings = async () => {
    try {
      // In a real app, you'd fetch from a settings table
      // For now, we'll use the default values
    } catch (error) {
      console.error('Error fetching store settings:', error)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      setError('Email is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // In a real app, you'd send an invitation email and create a pending admin user
      const newUser: AdminUser = {
        id: Date.now().toString(),
        email: newAdminEmail.trim(),
        role: newAdminRole,
        created_at: new Date().toISOString()
      }

      setAdminUsers(prev => [...prev, newUser])
      setNewAdminEmail('')
      setNewAdminRole('manager')
      setSuccess('Admin user added successfully')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to add admin user')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'manager' | 'viewer') => {
    try {
      setAdminUsers(prev => 
        prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      )
      setEditingUser(null)
      setSuccess('User role updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to update user role')
    }
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (confirm('Are you sure you want to remove this admin user?')) {
      try {
        setAdminUsers(prev => prev.filter(user => user.id !== userId))
        setSuccess('Admin user removed successfully')
        setTimeout(() => setSuccess(''), 3000)
      } catch (error: any) {
        setError(error.message || 'Failed to remove admin user')
      }
    }
  }

  const handleSaveStoreSettings = async () => {
    setIsLoading(true)
    setError('')

    try {
      // In a real app, you'd save to a settings table
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSuccess('Store settings saved successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to save store settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveNotificationSettings = async () => {
    setIsLoading(true)
    setError('')

    try {
      // In a real app, you'd save to a settings table
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setSuccess('Notification settings saved successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || 'Failed to save notification settings')
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = async (type: 'products' | 'orders' | 'customers') => {
    try {
      // In a real app, you'd generate and download the file
      setSuccess(`${type} data exported successfully`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message || `Failed to export ${type} data`)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Admin Settings</h2>
              <p className="text-sm text-gray-600">Manage your store configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 p-6 border-b">
          {[
            { id: 'users', label: 'Admin Users', icon: Users },
            { id: 'store', label: 'Store Settings', icon: Store },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'data', label: 'Data Management', icon: Database }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mx-6 mt-4 flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="mx-6 mt-4 flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Admin Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Manage Admin Users</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="email"
                    placeholder="your-email@yourdomain.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleAddAdmin}
                    disabled={isLoading || !newAdminEmail.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>Add Admin</span>
                  </button>
                </div>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {adminUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : 'N/A'
                              }
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {editingUser === user.id ? (
                              <div className="flex items-center space-x-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateUserRole(user.id, e.target.value as any)}
                                  className="px-2 py-1 text-xs border border-gray-300 rounded"
                                >
                                  <option value="viewer">Viewer</option>
                                  <option value="manager">Manager</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setEditingUser(user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                            )}
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handleRemoveAdmin(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Role Permissions</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Admin:</strong> Full access to all features and settings</p>
                  <p><strong>Manager:</strong> Can manage products, orders, and customers. Limited settings access.</p>
                  <p><strong>Viewer:</strong> Read-only access to dashboard and reports</p>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings Tab */}
          {activeTab === 'store' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Store Configuration</h3>
                <button
                  onClick={handleSaveStoreSettings}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Store Info */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                    <input
                      type="text"
                      value={storeSettings.store_name}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, store_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Email</label>
                    <input
                      type="email"
                      value={storeSettings.store_email}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, store_email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Phone</label>
                    <input
                      type="text"
                      value={storeSettings.store_phone}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, store_phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Address</label>
                    <textarea
                      value={storeSettings.store_address}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, store_address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Business Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Business Settings</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="KSH">KSH (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={storeSettings.tax_rate}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, tax_rate: parseFloat(e.target.value) }))}
                      step="0.1"
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost</label>
                    <input
                      type="number"
                      value={storeSettings.shipping_cost}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, shipping_cost: parseFloat(e.target.value) }))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
                    <input
                      type="number"
                      value={storeSettings.free_shipping_threshold}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, free_shipping_threshold: parseFloat(e.target.value) }))}
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                    <input
                      type="number"
                      value={storeSettings.low_stock_threshold}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, low_stock_threshold: parseInt(e.target.value) }))}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={storeSettings.auto_order_enabled}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, auto_order_enabled: e.target.checked }))}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Enable automatic reordering for low stock items
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                <button
                  onClick={handleSaveNotificationSettings}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>Save Settings</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Alert Types */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Alert Types</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Low Stock Alerts</label>
                        <p className="text-xs text-gray-500">Get notified when products are running low</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.low_stock_alerts}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, low_stock_alerts: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">New Order Notifications</label>
                        <p className="text-xs text-gray-500">Get notified when new orders are placed</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.new_order_notifications}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, new_order_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Customer Registration Alerts</label>
                        <p className="text-xs text-gray-500">Get notified when new customers register</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.customer_registration_alerts}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, customer_registration_alerts: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">System Maintenance Alerts</label>
                        <p className="text-xs text-gray-500">Get notified about system updates and maintenance</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.system_maintenance_alerts}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, system_maintenance_alerts: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Channels */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Notification Channels</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <p className="text-xs text-gray-500">Receive notifications via email</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.email_notifications}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, email_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                        <p className="text-xs text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.sms_notifications}
                        onChange={(e) => setNotificationSettings(prev => ({ ...prev, sms_notifications: e.target.checked }))}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Notification Settings</h5>
                    <p className="text-xs text-blue-700">
                      Configure how and when you receive important alerts about your store operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Data Management</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Data */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Export Data</h4>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => exportData('products')}
                      className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Products Catalog</span>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => exportData('orders')}
                      className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <ShoppingCart className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Order History</span>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>

                    <button
                      onClick={() => exportData('customers')}
                      className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Customer Database</span>
                      </div>
                      <Download className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Import Data */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Import Data</h4>
                  
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload CSV or Excel files</p>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Choose File
                      </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-yellow-900 mb-2">Import Guidelines</h5>
                      <ul className="text-xs text-yellow-700 space-y-1">
                        <li>• Use CSV format for best compatibility</li>
                        <li>• Include headers in the first row</li>
                        <li>• Ensure data matches your schema</li>
                        <li>• Backup existing data before import</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Maintenance */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 border-b pb-2">Database Maintenance</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Database className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Optimize Database</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Shield className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Backup Data</span>
                  </button>
                  
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">System Health</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
