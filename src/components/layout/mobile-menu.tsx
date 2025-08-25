'use client'

import { X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/auth-context'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { state: { user } } = useAuth()
  
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={onClose} className="p-2">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-4">
            <Link href="/products" className="block py-2 text-lg font-medium hover:text-primary">
              Shop Parts
            </Link>
            <Link href="/deals" className="block py-2 text-lg font-medium hover:text-primary">
              Deals & Promotions
            </Link>
            <Link href="/categories/engine-filters" className="block py-2 text-lg font-medium hover:text-primary">
              Engine & Filters
            </Link>
            <Link href="/categories/brakes-suspension" className="block py-2 text-lg font-medium hover:text-primary">
              Brakes & Suspension
            </Link>
            <Link href="/categories/electrical" className="block py-2 text-lg font-medium hover:text-primary">
              Electrical
            </Link>
            <Link href="/vehicles" className="block py-2 text-lg font-medium hover:text-primary">
              Our Vehicles
            </Link>
            <Link href="/diy" className="block py-2 text-lg font-medium hover:text-primary">
              DIY Guides
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className="block py-2 text-lg font-medium hover:text-primary">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  )
}
