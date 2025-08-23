'use client'

import { useAuth } from '@/components/auth/auth-context'
import { User, Package, Heart, Settings, MapPin, Phone, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const { state } = useAuth()

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your account</h1>
          <Link href="/login" className="text-primary hover:underline">
            Go to login page
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Welcome back, {state.user.name}!</p>
        </div>

        {/* Account Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900">{state.user.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{state.user.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-outline">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/orders"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Package className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">My Orders</p>
                    <p className="text-sm text-gray-600">Track your orders</p>
                  </div>
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Heart className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Wishlist</p>
                    <p className="text-sm text-gray-600">Saved items</p>
                  </div>
                </Link>
                
                <Link
                  href="/settings"
                  className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">Settings</p>
                    <p className="text-sm text-gray-600">Account preferences</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>1-800-AUTOZONE</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@autozone.com</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Find a store</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
