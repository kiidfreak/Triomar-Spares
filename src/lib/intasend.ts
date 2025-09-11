/**
 * IntaSend API Integration using Official SDK
 * Handles M-Pesa STK Push and Card Payments
 */

import IntaSend from 'intasend-node'

export interface IntaSendConfig {
  publicKey: string
  secretKey: string
  businessName: string
  businessPhone: string
  businessEmail: string
  isLive: boolean
}

export interface MpesaPaymentRequest {
  amount: number
  phone_number: string
  currency: string
  narrative: string
  account_reference: string
  first_name?: string
  last_name?: string
  email?: string
  host?: string
}

export interface CardPaymentRequest {
  amount: number
  currency: string
  narrative: string
  account_reference: string
  first_name?: string
  last_name?: string
  email?: string
  host?: string
}

export interface GooglePayPaymentRequest {
  amount: number
  currency: string
  narrative: string
  account_reference: string
  first_name?: string
  last_name?: string
  email?: string
  host?: string
}

export interface IntaSendResponse {
  success: boolean
  data?: any
  error?: string
  message?: string
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  transaction_id?: string
  amount?: number
  currency?: string
  phone_number?: string
  narrative?: string
  account_reference?: string
  created_at?: string
  updated_at?: string
}

class IntaSendAPI {
  private config: IntaSendConfig
  private intasend: any

  constructor() {
    this.config = {
      publicKey: process.env.INTASEND_PUBLIC_KEY || '',
      secretKey: process.env.INTASEND_SECRET_KEY || '',
      businessName: process.env.BUSINESS_NAME || 'Triomar AutoSpares',
      businessPhone: process.env.BUSINESS_PHONE || '+254700000000',
      businessEmail: process.env.BUSINESS_EMAIL || 'info@triomarautospares.com',
      isLive: false // Using test mode for now - change to true when ready for live payments
    }

    // Initialize IntaSend SDK
    this.intasend = new IntaSend(
      this.config.publicKey,
      this.config.secretKey,
      this.config.isLive
    )
  }

  /**
   * Initiate M-Pesa STK Push Payment
   */
  async initiateMpesaPayment(request: MpesaPaymentRequest): Promise<IntaSendResponse> {
    const payload = {
      first_name: request.first_name || 'Customer',
      last_name: request.last_name || 'Name',
      email: request.email || this.config.businessEmail,
      host: request.host || process.env.NEXTAUTH_URL || 'https://triomarautospares.co.uk',
      amount: request.amount,
      currency: request.currency || 'KES',
      phone_number: request.phone_number,
      api_ref: request.account_reference,
      narrative: request.narrative
    }

    try {
      const collection = this.intasend.collection()
      const response = await collection.mpesaStkPush(payload)
      
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('M-Pesa STK Push Error:', error)
      
      // Parse error response if it's a buffer
      let errorData = error.response?.data
      if (Buffer.isBuffer(errorData)) {
        try {
          errorData = JSON.parse(errorData.toString())
        } catch (parseError) {
          errorData = errorData.toString()
        }
      }
      
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: errorData,
        payload: payload
      })
      
      // Extract meaningful error message
      let errorMessage = error.message || 'Failed to initiate M-Pesa payment'
      if (errorData && typeof errorData === 'object') {
        if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorMessage = errorData.errors[0].message || errorData.errors[0].code || errorMessage
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  /**
   * Create Card Payment Session
   */
  async createCardPaymentSession(request: CardPaymentRequest): Promise<IntaSendResponse> {
    const payload = {
      first_name: request.first_name || 'Customer',
      last_name: request.last_name || 'Name',
      email: request.email || this.config.businessEmail,
      host: request.host || process.env.NEXTAUTH_URL || 'https://triomarautospares.co.uk',
      amount: request.amount,
      currency: request.currency || 'KES',
      api_ref: request.account_reference,
      narrative: request.narrative
    }

    try {
      // Use the collection.charge method for card payments
      const collection = this.intasend.collection()
      const response = await collection.charge(payload)
      
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Card Payment Error:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        payload: payload
      })
      return {
        success: false,
        error: error.message || 'Failed to create card payment session'
      }
    }
  }

  /**
   * Create Google Pay Payment Session
   */
  async createGooglePayPaymentSession(request: GooglePayPaymentRequest): Promise<IntaSendResponse> {
    try {
      const collection = this.intasend.collection()
      
      const payload = {
        first_name: request.first_name || 'Customer',
        last_name: request.last_name || 'Name',
        email: request.email || this.config.businessEmail,
        host: request.host || process.env.NEXTAUTH_URL || 'https://triomarautospares.co.uk',
        amount: request.amount,
        currency: request.currency || 'KES',
        api_ref: request.account_reference,
        narrative: request.narrative,
        payment_methods: ['card', 'google_pay'] // Enable both card and Google Pay
      }

      const response = await collection.charge(payload)
      
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Google Pay Payment Error:', error)
      return {
        success: false,
        error: error.message || 'Failed to create Google Pay payment session'
      }
    }
  }

  /**
   * Check Payment Status
   */
  async checkPaymentStatus(accountReference: string): Promise<IntaSendResponse> {
    try {
      const response = await this.intasend.collection().status(accountReference)
      
      console.log('IntaSend status check for', accountReference, ':', response)
      
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Payment Status Check Error:', error)
      return {
        success: false,
        error: error.message || 'Failed to check payment status'
      }
    }
  }

  /**
   * Get Payment Details
   */
  async getPaymentDetails(transactionId: string): Promise<IntaSendResponse> {
    try {
      const response = await this.intasend.collection().status(transactionId)
      
      return {
        success: true,
        data: response
      }
    } catch (error: any) {
      console.error('Payment Details Error:', error)
      return {
        success: false,
        error: error.message || 'Failed to get payment details'
      }
    }
  }

  /**
   * Verify Webhook Signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    // IntaSend webhook verification logic
    // This would typically involve HMAC verification
    // For now, we'll implement a basic check
    const expectedSignature = process.env.INTASEND_WEBHOOK_SECRET
    return signature === expectedSignature
  }

  /**
   * Get Public Key for Frontend
   */
  getPublicKey(): string {
    return this.config.publicKey
  }

  /**
   * Get Business Information
   */
  getBusinessInfo() {
    return {
      name: this.config.businessName,
      phone: this.config.businessPhone,
      email: this.config.businessEmail
    }
  }
}

// Export singleton instance
export const intaSendAPI = new IntaSendAPI()
