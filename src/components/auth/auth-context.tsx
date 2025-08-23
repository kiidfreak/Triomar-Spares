'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  phone?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthContextType {
  state: AuthState
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string) => Promise<boolean>
  signOut: () => void
  resetPassword: (email: string) => Promise<boolean>
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState)

  // Check for existing user on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setState({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          localStorage.removeItem('user')
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication - in real app, this would call your auth API
      if (email === 'demo@example.com' && password === 'password') {
        const user: User = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          phone: '+44 7349 013628'
        }
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        })
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user))
        }
        return true
      } else {
        setState(prev => ({ ...prev, isLoading: false }))
        return false
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock registration - in real app, this would call your auth API
      const user: User = {
        id: Date.now().toString(),
        email,
        name
      }
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      })
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }
      return true
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signOut = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    })
    
    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock password reset - in real app, this would call your auth API
      setState(prev => ({ ...prev, isLoading: false }))
      return true
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
