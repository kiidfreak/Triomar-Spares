'use client'

import { useAuth } from '@/components/auth/auth-context'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus, ShoppingCart } from 'lucide-react'

interface AuthRequiredProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthRequired({ children, fallback }: AuthRequiredProps) {
  const { state } = useAuth()
  const router = useRouter()

  if (state.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }

  if (!state.user) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to your account to create an order and complete your purchase.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="h-5 w-5" />
              <span>Sign In</span>
            </button>
            
            <button
              onClick={() => router.push('/auth/signup')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Create Account</span>
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? Creating one is quick and free!
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
