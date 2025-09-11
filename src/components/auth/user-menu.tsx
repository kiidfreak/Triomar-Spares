'use client'

import { useState, useEffect } from 'react'
import { User, LogOut, Settings, Package, Heart, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react'
import { useAuth } from './auth-context'
import { useAuthModal } from './auth-modal-context'
import Link from 'next/link'

export function UserMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { isSignInOpen, isSignUpOpen, openSignIn, openSignUp, closeModals } = useAuthModal()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const { signIn, signUp, signOut, state } = useAuth()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSignInOpen || isSignUpOpen || isDropdownOpen) {
        const target = event.target as Element
        if (!target.closest('.user-menu-dropdown')) {
          closeModals()
          setIsDropdownOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isSignInOpen, isSignUpOpen, isDropdownOpen, closeModals])

  if (!state.user) {
    return (
      <div className="relative user-menu-dropdown">
        <div className="flex items-center space-x-2">
          <button
            onClick={openSignIn}
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={openSignUp}
            className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Dropdown */}
        {isSignInOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sign In</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                if (!email || !password) {
                  setError('Please fill in all fields')
                  return
                }
                const success = await signIn(email, password)
                if (success) {
                  closeModals()
                  setEmail('')
                  setPassword('')
                } else {
                  setError('Invalid email or password. Please check your credentials.')
                }
              }} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                      placeholder="Enter your email"
                      style={{ color: 'black', WebkitTextFillColor: 'black' }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                      placeholder="Enter your password"
                      style={{ color: 'black', WebkitTextFillColor: 'black' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {state.isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Sign Up Dropdown */}
        {isSignUpOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
                <button
                  onClick={closeModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault()
                setError('')
                if (!name || !email || !password || !confirmPassword) {
                  setError('Please fill in all fields')
                  return
                }
                if (password !== confirmPassword) {
                  setError('Passwords do not match')
                  return
                }
                if (password.length < 6) {
                  setError('Password must be at least 6 characters long')
                  return
                }
                const success = await signUp(email, password, name)
                if (success) {
                  closeModals()
                  setName('')
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                } else {
                  setError('Failed to create account. Please try again.')
                }
              }} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                    placeholder="Enter your full name"
                    style={{ color: 'black', WebkitTextFillColor: 'black' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                      placeholder="Enter your email"
                      style={{ color: 'black', WebkitTextFillColor: 'black' }}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                      placeholder="Enter your password"
                      style={{ color: 'black', WebkitTextFillColor: 'black' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm bg-white"
                      placeholder="Confirm your password"
                      style={{ color: 'black', WebkitTextFillColor: 'black' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {state.isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative user-menu-dropdown">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-colors text-gray-700 hover:text-gray-900"
      >
        <User className="h-5 w-5" />
        <span className="text-sm font-medium">{state.user.name}</span>
      </button>
      
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
        <div className="py-2">
              <div className="px-4 py-2 border-b">
                <p className="text-sm font-medium text-gray-900">{state.user.name}</p>
                <p className="text-xs text-gray-500">{state.user.email}</p>
          </div>
              
              <Link
                href="/account"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="h-4 w-4 mr-3" />
                My Account
          </Link>
              
              <Link
                href="/orders"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Package className="h-4 w-4 mr-3" />
            My Orders
          </Link>
              
              <Link
                href="/wishlist"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Heart className="h-4 w-4 mr-3" />
                Wishlist
              </Link>
              
              <Link
                href="/settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
          </Link>
              
              {/* Admin Manage Link */}
              {state.user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Manage
                </Link>
              )}
              
              <div className="border-t">
                <button
                  onClick={() => {
                    signOut()
                    setIsDropdownOpen(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  )
}
