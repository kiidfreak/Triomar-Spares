'use client'

import { useCart } from './cart-context'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CartDrawerProps {
  isOpen?: boolean
  onClose?: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps = {}) {
  const { state, removeItem, updateQuantity, clearCart, getTotalPrice, closeCart } = useCart()
  
  // Use props if provided, otherwise use cart context
  const isOpenState = isOpen !== undefined ? isOpen : state.isOpen
  const onCloseHandler = onClose || closeCart

  if (!isOpenState) {
    return null
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        onClick={onCloseHandler}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full bg-white shadow-xl z-[9999] transform transition-all duration-300 ease-in-out ${
        state.items.length === 0 ? 'w-80' : 'w-full max-w-lg md:max-w-xl lg:max-w-2xl'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Shopping Cart ({state.items.length})
            </h2>
            <button
              onClick={onCloseHandler}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 min-h-0">
            
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some items to get started</p>
                <Link
                  href="/categories/engine-filters"
                  onClick={onCloseHandler}
                  className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex space-x-4 p-4 border rounded-lg bg-white shadow-sm">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-2 leading-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-3">
                        SKU: {item.sku}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">{item.price}</span>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-primary">{getTotalPrice()}</span>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={clearCart}
                  className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Clear Cart
                </button>
                <Link
                  href="/checkout"
                  onClick={onCloseHandler}
                  className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors text-center font-medium"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
