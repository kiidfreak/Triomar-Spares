'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-context'
import { useAuthModal } from '@/components/auth/auth-modal-context'
import { X, UserPlus, Gift, Truck, Shield } from 'lucide-react'

export function SignupBanner() {
  const { state } = useAuth()
  const { openSignIn, openSignUp } = useAuthModal()
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show banner if user is authenticated or if it's been dismissed
  if (state.user || isDismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5" />
              <span className="text-sm font-medium">10% off first order</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5" />
              <span className="text-sm font-medium">Free shipping over KSH 10,000</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Track your orders</span>
            </div>
          </div>
          <div className="md:hidden">
            <span className="text-sm font-medium">Join for exclusive deals!</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={openSignUp}
            className="bg-white text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up Free</span>
          </button>
          <button 
            onClick={openSignIn}
            className="text-white hover:text-gray-200 transition-colors font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
