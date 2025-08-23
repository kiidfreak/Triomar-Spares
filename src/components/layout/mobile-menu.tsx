'use client'

import { X } from 'lucide-react'
import Link from 'next/link'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
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
            <Link href="/shop" className="block py-2 text-lg font-medium hover:text-primary">
              Shop All Parts
            </Link>
            <Link href="/categories/brakes" className="block py-2 text-lg font-medium hover:text-primary">
              Brakes
            </Link>
            <Link href="/categories/batteries" className="block py-2 text-lg font-medium hover:text-primary">
              Batteries
            </Link>
            <Link href="/categories/oil-fluids" className="block py-2 text-lg font-medium hover:text-primary">
              Oil & Fluids
            </Link>
            <Link href="/diy" className="block py-2 text-lg font-medium hover:text-primary">
              DIY Guides
            </Link>
            <Link href="/deals" className="block py-2 text-lg font-medium hover:text-primary">
              Deals & Promotions
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
