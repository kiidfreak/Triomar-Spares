'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Loader2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface IntaSendPaymentProps {
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

export default function IntaSendPayment({ 
  orderId, 
  amount, 
  currency = 'KES',
  onPaymentSuccess,
  onPaymentError 
}: IntaSendPaymentProps) {
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
      const response = await fetch('/api/payments/intasend/mpesa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          phone_number: mpesaPhone
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to initiate M-Pesa payment')
      }

      toast.success('M-Pesa payment initiated! Check your phone for STK Push.')
      setPaymentStatus('success')
      
      // Start polling for payment status
      pollPaymentStatus()
      
      if (onPaymentSuccess) {
        onPaymentSuccess(data.data)
      }

    } catch (error: any) {
      console.error('M-Pesa payment error:', error)
      toast.error(error.message || 'M-Pesa payment failed')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCardPayment = async () => {
    if (!cardDetails.firstName || !cardDetails.lastName || !cardDetails.email) {
      toast.error('Please fill in all card payment details')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('pending')

    try {
      const response = await fetch('/api/payments/intasend/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          first_name: cardDetails.firstName,
          last_name: cardDetails.lastName,
          email: cardDetails.email
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create card payment session')
      }

      // Redirect to IntaSend payment page
      if (data.data.payment_url) {
        window.location.href = data.data.payment_url
      } else {
        throw new Error('Payment URL not received')
      }

    } catch (error: any) {
      console.error('Card payment error:', error)
      toast.error(error.message || 'Card payment failed')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGooglePayPayment = async () => {
    if (!cardDetails.firstName || !cardDetails.lastName || !cardDetails.email) {
      toast.error('Please fill in all payment details')
      return
    }

    setIsProcessing(true)
    setPaymentStatus('pending')

    try {
      const response = await fetch('/api/payments/intasend/googlepay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          first_name: cardDetails.firstName,
          last_name: cardDetails.lastName,
          email: cardDetails.email
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create Google Pay payment session')
      }

      // Redirect to IntaSend payment page with Google Pay enabled
      if (data.data.payment_url) {
        window.location.href = data.data.payment_url
      } else {
        throw new Error('Payment URL not received')
      }

    } catch (error: any) {
      console.error('Google Pay payment error:', error)
      toast.error(error.message || 'Google Pay payment failed')
      setPaymentStatus('error')
      
      if (onPaymentError) {
        onPaymentError(error.message)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const pollPaymentStatus = async () => {
    const maxAttempts = 30 // Poll for 5 minutes (10 second intervals)
    let attempts = 0

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('Payment status check timeout')
        return
      }

      try {
        const response = await fetch(`/api/payments/intasend/${selectedMethod}?order_id=${orderId}`)
        const data = await response.json()

        if (data.success && data.data) {
          if (data.data.status === 'confirmed') {
            setPaymentStatus('success')
            toast.success('Payment completed successfully!')
            if (onPaymentSuccess) {
              onPaymentSuccess(data.data)
            }
            return
          } else if (data.data.status === 'payment_failed') {
            setPaymentStatus('error')
            toast.error('Payment failed')
            if (onPaymentError) {
              onPaymentError('Payment failed')
            }
            return
          }
        }

        attempts++
        setTimeout(poll, 10000) // Poll every 10 seconds
      } catch (error) {
        console.error('Payment status check error:', error)
        attempts++
        setTimeout(poll, 10000)
      }
    }

    poll()
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as 254XXXXXXXXX or 0XXXXXXXXX
    if (digits.startsWith('254')) {
      return digits
    } else if (digits.startsWith('0')) {
      return digits
    } else if (digits.length > 0) {
      return `0${digits}`
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
              Phone Number *
            </label>
            <input
              type="tel"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(formatPhoneNumber(e.target.value))}
              placeholder="254XXXXXXXXX or 0XXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter your M-Pesa registered phone number
            </p>
          </div>
        </div>
      )}

      {(selectedMethod === 'card' || selectedMethod === 'googlepay') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {selectedMethod === 'googlepay' ? 'Google Pay Details' : 'Card Payment Details'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={cardDetails.firstName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={cardDetails.lastName}
                onChange={(e) => setCardDetails(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isProcessing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={cardDetails.email}
              onChange={(e) => setCardDetails(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isProcessing}
            />
          </div>
        </div>
      )}

      {/* Payment Status */}
      {paymentStatus !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          paymentStatus === 'success' ? 'bg-green-50 text-green-800' :
          paymentStatus === 'error' ? 'bg-red-50 text-red-800' :
          'bg-blue-50 text-blue-800'
        }`}>
          {paymentStatus === 'success' && <CheckCircle className="h-5 w-5" />}
          {paymentStatus === 'error' && <XCircle className="h-5 w-5" />}
          {paymentStatus === 'pending' && <Loader2 className="h-5 w-5 animate-spin" />}
          <span>
            {paymentStatus === 'success' && 'Payment completed successfully!'}
            {paymentStatus === 'error' && 'Payment failed. Please try again.'}
            {paymentStatus === 'pending' && 'Processing payment...'}
          </span>
        </div>
      )}

      {/* Payment Button */}
      <button
        onClick={() => {
          if (selectedMethod === 'mpesa') {
            handleMpesaPayment()
          } else if (selectedMethod === 'card') {
            handleCardPayment()
          } else if (selectedMethod === 'googlepay') {
            handleGooglePayPayment()
          }
        }}
        disabled={isProcessing || paymentStatus === 'success'}
        className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {selectedMethod === 'mpesa' ? <Smartphone className="h-5 w-5" /> : 
             selectedMethod === 'card' ? <CreditCard className="h-5 w-5" /> :
             <div className="h-5 w-5 bg-white rounded flex items-center justify-center">
               <span className="text-black text-xs font-bold">G</span>
             </div>}
            <span>
              Pay {currency} {amount} with {
                selectedMethod === 'mpesa' ? 'M-Pesa' : 
                selectedMethod === 'card' ? 'Card' : 
                'Google Pay'
              }
            </span>
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          🔒 Your payment information is secure and encrypted by IntaSend
        </p>
      </div>
    </div>
  )
}
