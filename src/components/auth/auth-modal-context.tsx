'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthModalContextType {
  isSignInOpen: boolean
  isSignUpOpen: boolean
  openSignIn: () => void
  openSignUp: () => void
  closeModals: () => void
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)

  const openSignIn = () => {
    setIsSignInOpen(true)
    setIsSignUpOpen(false)
  }

  const openSignUp = () => {
    setIsSignUpOpen(true)
    setIsSignInOpen(false)
  }

  const closeModals = () => {
    setIsSignInOpen(false)
    setIsSignUpOpen(false)
  }

  return (
    <AuthModalContext.Provider
      value={{
        isSignInOpen,
        isSignUpOpen,
        openSignIn,
        openSignUp,
        closeModals
      }}
    >
      {children}
    </AuthModalContext.Provider>
  )
}

export function useAuthModal() {
  const context = useContext(AuthModalContext)
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}
