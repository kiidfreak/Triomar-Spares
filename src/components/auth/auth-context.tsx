'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react'

interface ExtendedUser {
  id?: string
  email?: string | null
  name?: string | null
  role?: string
}

interface AuthState {
  user: ExtendedUser | null
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
  const session = useSession()
  const [state, setState] = useState<AuthState>(initialState)

  useEffect(() => {
    if (session.status === 'loading') {
      setState((prev) => ({ ...prev, isLoading: true }))
    } else if (session.status === 'authenticated') {
      const user = session.data?.user
      const role = (user as any)?.role || 'user'
      
      setState({
        user: { 
          id: (user as any)?.id, 
          email: user?.email || null, 
          name: user?.name || null,
          role: role
        },
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [session.status, session.data])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    const res = await nextAuthSignIn('credentials', { redirect: false, email, password })
    setState(prev => ({ ...prev, isLoading: false }))
    return !!res?.ok
  }

  const signUp = async (email: string, password: string, name: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }))
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const data = await resp.json()
      if (!resp.ok || !data?.ok) {
        setState(prev => ({ ...prev, isLoading: false }))
        return false
      }
      // auto sign-in after register
      const res = await nextAuthSignIn('credentials', { redirect: false, email, password })
      setState(prev => ({ ...prev, isLoading: false }))
      return !!res?.ok
    } catch {
      setState(prev => ({ ...prev, isLoading: false }))
      return false
    }
  }

  const signOut = () => {
    nextAuthSignOut({ redirect: false })
  }

  const resetPassword = async () => {
    // Not implemented; backend needed for email flows
    return true
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
