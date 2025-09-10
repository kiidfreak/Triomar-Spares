/**
 * Utility functions for generating and managing payment links
 */

export interface PaymentLinkOptions {
  orderId: string
  amount: number
  currency?: string
  description?: string
  expiresIn?: number // hours
}

export interface PaymentLink {
  url: string
  orderId: string
  amount: number
  currency: string
  expiresAt?: Date
  createdAt: Date
}

/**
 * Generate a payment link for an order
 */
export function generatePaymentLink(options: PaymentLinkOptions): PaymentLink {
  const { orderId, amount, currency = 'KES', expiresIn } = options
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const url = `${baseUrl}/pay/${orderId}`
  
  const paymentLink: PaymentLink = {
    url,
    orderId,
    amount,
    currency,
    createdAt: new Date()
  }
  
  if (expiresIn) {
    paymentLink.expiresAt = new Date(Date.now() + expiresIn * 60 * 60 * 1000)
  }
  
  return paymentLink
}

/**
 * Generate a payment link and return just the URL
 */
export function getPaymentUrl(orderId: string): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${baseUrl}/pay/${orderId}`
}

/**
 * Validate if a payment link is still valid
 */
export function isPaymentLinkValid(paymentLink: PaymentLink): boolean {
  if (!paymentLink.expiresAt) {
    return true // No expiration set
  }
  
  return new Date() < paymentLink.expiresAt
}

/**
 * Generate a QR code data URL for a payment link
 */
export function generateQRCodeData(paymentLink: PaymentLink): string {
  // This would typically use a QR code library
  // For now, we'll return the URL as a data URL placeholder
  return `data:text/plain;base64,${btoa(paymentLink.url)}`
}

/**
 * Format payment link for sharing
 */
export function formatPaymentLinkForSharing(paymentLink: PaymentLink): string {
  const { url, amount, currency } = paymentLink
  
  return `Pay KSH ${amount.toLocaleString()} ${currency}\n\nPayment Link: ${url}`
}
