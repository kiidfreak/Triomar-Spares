'use client'

import { useState } from 'react'
import { Copy, ExternalLink, QrCode, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentLinkGeneratorProps {
  orderId: string
  amount: number
  status: string
}

export default function PaymentLinkGenerator({ orderId, amount, status }: PaymentLinkGeneratorProps) {
  const [paymentLink, setPaymentLink] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const generatePaymentLink = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          expiresIn: 24 // 24 hours
        })
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Failed to generate payment link')
      }

      setPaymentLink(data.paymentLink.url)
      toast.success('Payment link generated successfully!')
    } catch (error: any) {
      console.error('Error generating payment link:', error)
      toast.error(error.message || 'Failed to generate payment link')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!paymentLink) return

    try {
      await navigator.clipboard.writeText(paymentLink)
      setCopied(true)
      toast.success('Payment link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareLink = async () => {
    if (!paymentLink) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Link',
          text: `Pay KSH ${amount.toLocaleString()} for your order`,
          url: paymentLink
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard()
    }
  }

  if (status === 'paid') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-xs">✓</span>
          </div>
          <p className="text-green-800 font-medium">Payment completed</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Payment Link</h3>
        <span className="text-sm text-gray-500">KSH {amount.toLocaleString()}</span>
      </div>

      {!paymentLink ? (
        <button
          onClick={generatePaymentLink}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Payment Link'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600 break-all">{paymentLink}</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            
            <button
              onClick={shareLink}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-2 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Pay</span>
            </a>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Link expires in 24 hours
          </p>
        </div>
      )}
    </div>
  )
}
