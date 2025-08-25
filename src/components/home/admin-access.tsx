'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Eye, EyeOff } from 'lucide-react'

export function AdminAccess() {
  const [showCredentials, setShowCredentials] = useState(false)

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 my-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">Admin Access</h2>
        </div>
        <p className="text-gray-600 mb-4">
          For testing purposes, you can access the admin dashboard with these demo credentials:
        </p>
        
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Demo Admin Account:</span>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
            >
              {showCredentials ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Hide</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Show</span>
                </>
              )}
            </button>
          </div>
          
          {showCredentials && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700 w-20">Email:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">admin@autozone.com</code>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-700 w-20">Password:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">admin123</code>
              </div>
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/login" 
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              <Shield className="h-4 w-4" />
              <span>Go to Login</span>
            </Link>
            <span className="text-xs text-gray-500 ml-3">
              After login, you'll see an "Admin" link in the navigation
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
