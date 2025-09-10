'use client'

import { useState } from 'react'
import { Smartphone, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

interface MockPaymentProps {
  orderId: string
  amount: string
  currency?: string
  onPaymentSuccess?: (data: any) => void
  onPaymentError?: (error: string) => void
}

interface PaymentMethod {
  id: 'mpesa' | 'card' | 'googlepay'
  name: string
  description: string
  icon: React.ReactNode
  popular?: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    description: 'Pay with M-Pesa mobile money',
    icon: <Smartphone className="h-5 w-5" />,
    popular: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay with Visa, Mastercard, or American Express',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    description: 'Pay with Google Pay - Fast and secure',
    icon: <div className="h-5 w-5 bg-black rounded flex items-center justify-center">
      <span className="text-white text-xs font-bold">G</span>
    </div>,
    popular: true
  }
]

export default function MockPayment({ 
  orderId, 
  amount, 
  currency = 'KES',
  onPaymentSuccess,
  onPaymentError 
}: MockPaymentProps) {
  
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'card' | 'googlepay'>('mpesa')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [cardDetails, setCardDetails] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  const handleMpesaPayment = async () => {
    if (!mpesaPhone.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('pending')

    try {
      // Mock M-Pesa payment - simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful payment
      const mockData = {
        success: true,
        transaction_id: `MPESA_${Date.now()}`,
        message: 'Payment successful',
        order_id: orderId
      }

      toast.success('M-Pesa payment completed successfully!')
      setPaymentStatus('success')
      
      if (onPaymentSuccess) {
        onPaymentSuccess(mockData)
      }
    } catch (error: any) {
      console.error('M-Pesa payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message || 'Payment failed')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async () => {
    if (!cardDetails.firstName || !cardDetails.lastName || !cardDetails.email) {
      toast.error('Please fill in all card details')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('pending')

    try {
      // Mock card payment - simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate successful payment
      const mockData = {
        success: true,
        transaction_id: `CARD_${Date.now()}`,
        message: 'Payment successful',
        order_id: orderId
      }

      toast.success('Card payment completed successfully!')
      setPaymentStatus('success')
      
      if (onPaymentSuccess) {
        onPaymentSuccess(mockData)
      }
    } catch (error: any) {
      console.error('Card payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message || 'Payment failed')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGooglePayPayment = async () => {
    setIsProcessing(true)
    setPaymentStatus('pending')

    try {
      // Mock Google Pay payment - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful payment
      const mockData = {
        success: true,
        transaction_id: `GOOGLE_${Date.now()}`,
        message: 'Payment successful',
        order_id: orderId
      }

      toast.success('Google Pay payment completed successfully!')
      setPaymentStatus('success')
      
      if (onPaymentSuccess) {
        onPaymentSuccess(mockData)
      }
    } catch (error: any) {
      console.error('Google Pay payment error:', error)
      toast.error(error.message || 'Payment failed. Please try again.')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message || 'Payment failed')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as 254XXXXXXXXX
    if (digits.startsWith('0')) {
      return '254' + digits.substring(1)
    } else if (digits.startsWith('254')) {
      return digits
    } else if (digits.length > 0) {
      return '254' + digits
    }
    
    return digits
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Choose Payment Method</h3>
        </div>
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={(e) => setSelectedMethod(e.target.value as 'mpesa' | 'card' | 'googlepay')}
              className="sr-only"
            />
            <div className="flex items-center space-x-4 flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedMethod === method.id 
                  ? 'bg-red-500 text-white' 
                  : method.id === 'googlepay'
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-gray-100 text-gray-600'
              }`}>
                {method.id === 'googlepay' ? (
                  <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">G</span>
                  </div>
                ) : (
                  method.icon
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-900">{method.name}</span>
                  {method.popular && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Payment Details Form */}
      {selectedMethod === 'mpesa' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">M-Pesa Payment Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(formatPhoneNumber(e.target.value))}
              placeholder="0712345678"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your M-Pesa registered phone number
            </p>
          </div>
          <button
            onClick={handleMpesaPayment}
            disabled={isProcessing || !mpesaPhone.trim()}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay ${amount} ${currency} with M-Pesa`}
          </button>
        </div>
      )}

      {selectedMethod === 'card' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Card Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={cardDetails.firstName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={cardDetails.lastName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={cardDetails.email}
              onChange={(e) => setCardDetails(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleCardPayment}
            disabled={isProcessing || !cardDetails.firstName || !cardDetails.lastName || !cardDetails.email}
            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : `Pay ${amount} ${currency} with Card`}
          </button>
        </div>
      )}

      {selectedMethod === 'googlepay' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Google Pay Payment</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to complete your payment with Google Pay. 
              You'll be redirected to Google's secure payment page.
            </p>
            <button
              onClick={handleGooglePayPayment}
              disabled={isProcessing}
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-black text-xs font-bold">G</span>
                  </div>
                  <span>Pay {amount} {currency} with Google Pay</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">Payment completed successfully!</p>
          </div>
        </div>
      )}

      {paymentStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✗</span>
            </div>
            <p className="text-red-800 font-medium">Payment failed. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  )
}
