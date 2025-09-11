import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'
import { intaSendAPI, MpesaPaymentRequest } from '@/lib/intasend'

/**
 * M-Pesa STK Push Payment API
 * POST /api/payments/intasend/mpesa
 */
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const rawSession = await getServerSession(authOptions as any)
    const session = rawSession as any
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const body = await req.json()
    const { order_id, phone_number } = body

    if (!order_id || !phone_number) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID and phone number are required' 
      }, { status: 400 })
    }

    // Validate phone number format (Kenyan format)
    const cleanPhone = phone_number.replace(/\D/g, '')
    if (!cleanPhone.startsWith('254') && !cleanPhone.startsWith('0')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid phone number format. Use format: 254XXXXXXXXX or 0XXXXXXXXX' 
      }, { status: 400 })
    }

    // Format phone number for M-Pesa (254XXXXXXXXX)
    let formattedPhone
    if (cleanPhone.startsWith('254')) {
      formattedPhone = cleanPhone
    } else if (cleanPhone.startsWith('0')) {
      formattedPhone = `254${cleanPhone.substring(1)}`
    } else {
      formattedPhone = `254${cleanPhone}`
    }
    
    console.log('Phone formatting - Original:', phone_number, 'Cleaned:', cleanPhone, 'Formatted:', formattedPhone)

    // Get order details
    console.log('Looking up order:', order_id, 'for user:', session.user.email)
    const { rows } = await db.query(`
      SELECT o.id, o.final_amount, o.status, o.user_id, u.email, u.name
      FROM orders o 
      JOIN users_auth u ON u.id = o.user_id
      WHERE o.id = $1 AND u.email = $2
    `, [order_id, session.user.email])

    if (rows.length === 0) {
      console.error('Order not found for:', order_id, 'user:', session.user.email)
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }

    const order = rows[0]
    console.log('Order found:', order)
    
    if (order.status !== 'pending_payment') {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not ready for payment' 
      }, { status: 400 })
    }

    // Validate amount
    const amount = parseFloat(order.final_amount)
    if (amount <= 0) {
      console.error('Invalid order amount:', amount)
      return NextResponse.json({ 
        success: false, 
        error: 'Order amount must be greater than 0' 
      }, { status: 400 })
    }

    if (amount < 10) {
      console.error('Amount below minimum:', amount)
      return NextResponse.json({ 
        success: false, 
        error: 'Minimum payment amount is KES 10' 
      }, { status: 400 })
    }

    // Prepare M-Pesa payment request
    const mpesaRequest: MpesaPaymentRequest = {
      amount: parseFloat(order.final_amount), // Amount in KES (not cents)
      phone_number: formattedPhone,
      currency: 'KES',
      narrative: `Triomar AutoSpares - Order #${order_id}`,
      account_reference: order_id,
      first_name: order.name?.split(' ')[0] || 'Customer',
      last_name: order.name?.split(' ').slice(1).join(' ') || 'Name',
      email: order.email,
      host: process.env.NEXTAUTH_URL || 'https://triomarautospares.co.uk'
    }

    // Initiate M-Pesa payment
    console.log('M-Pesa request payload:', mpesaRequest)
    const paymentResponse = await intaSendAPI.initiateMpesaPayment(mpesaRequest)

    if (!paymentResponse.success) {
      console.error('M-Pesa payment initiation failed:', paymentResponse.error)
      console.error('Full payment response:', paymentResponse)
      return NextResponse.json({ 
        success: false, 
        error: paymentResponse.error || 'Failed to initiate M-Pesa payment' 
      }, { status: 500 })
    }

    // Store payment session in database
    await db.query(`
      INSERT INTO payment_sessions (order_id, provider, session_data, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (order_id) DO UPDATE SET
        session_data = $3,
        updated_at = NOW()
    `, [order_id, 'intasend_mpesa', JSON.stringify({
      phone_number: formattedPhone,
      amount: mpesaRequest.amount,
      currency: mpesaRequest.currency,
      narrative: mpesaRequest.narrative,
      account_reference: mpesaRequest.account_reference,
      intasend_response: paymentResponse.data
    })])

    // Update order status
    await db.query(`
      UPDATE orders 
      SET status = 'payment_pending', 
          payment_method = 'mpesa',
          updated_at = NOW()
      WHERE id = $1
    `, [order_id])

    // Log payment initiation
    await db.query(`
      INSERT INTO payment_logs (order_id, provider, status, transaction_id, response_data, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [order_id, 'intasend_mpesa', 'initiated', paymentResponse.data?.transaction_id || null, JSON.stringify(paymentResponse.data)])

    return NextResponse.json({
      success: true,
      message: 'M-Pesa payment initiated successfully',
      data: {
        order_id: order_id,
        phone_number: formattedPhone,
        amount: order.final_amount,
        currency: 'KES',
        transaction_id: paymentResponse.data?.transaction_id,
        status: 'pending'
      }
    })

  } catch (error: any) {
    console.error('M-Pesa payment API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 })
  }
}

/**
 * Check M-Pesa Payment Status
 * GET /api/payments/intasend/mpesa?order_id=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const rawSession = await getServerSession(authOptions as any)
    const session = rawSession as any
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const order_id = searchParams.get('order_id')

    if (!order_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 })
    }

    // Get order details
    const { rows } = await db.query(`
      SELECT o.id, o.status, o.payment_transaction_id, ps.session_data
      FROM orders o 
      LEFT JOIN payment_sessions ps ON ps.order_id = o.id
      JOIN users_auth u ON u.id = o.user_id
      WHERE o.id = $1 AND u.email = $2
    `, [order_id, session.user.email])

    if (rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }

    const order = rows[0]
    const sessionData = order.session_data ? JSON.parse(order.session_data) : null

    // Check payment status with IntaSend
    if (sessionData?.account_reference) {
      const statusResponse = await intaSendAPI.checkPaymentStatus(sessionData.account_reference)
      
      if (statusResponse.success && statusResponse.data) {
        // Update order status based on IntaSend response
        let newStatus = order.status
        if (statusResponse.data.status === 'completed') {
          newStatus = 'confirmed'
        } else if (statusResponse.data.status === 'failed') {
          newStatus = 'payment_failed'
        }

        if (newStatus !== order.status) {
          await db.query(`
            UPDATE orders 
            SET status = $1, 
                payment_transaction_id = $2,
                updated_at = NOW()
            WHERE id = $3
          `, [newStatus, statusResponse.data.transaction_id || order.payment_transaction_id, order_id])
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: order_id,
        status: order.status,
        payment_method: 'mpesa',
        transaction_id: order.payment_transaction_id
      }
    })

  } catch (error: any) {
    console.error('M-Pesa status check error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 })
  }
}
