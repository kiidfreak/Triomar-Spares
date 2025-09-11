import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'
import { intaSendAPI, CardPaymentRequest } from '@/lib/intasend'

/**
 * Card Payment API
 * POST /api/payments/intasend/card
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
    const { order_id, first_name, last_name, email } = body

    if (!order_id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Order ID is required' 
      }, { status: 400 })
    }

    // Get order details
    const { rows } = await db.query(`
      SELECT o.id, o.final_amount, o.status, o.user_id, u.email, u.name
      FROM orders o 
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
    
    if (order.status !== 'pending_payment') {
      return NextResponse.json({ 
        success: false, 
        error: 'Order not ready for payment' 
      }, { status: 400 })
    }

    // Prepare card payment request
    const cardRequest: CardPaymentRequest = {
      amount: parseFloat(order.final_amount), // Amount in KES
      currency: 'KES',
      narrative: `Triomar AutoSpares - Order #${order_id}`,
      account_reference: order_id,
      first_name: first_name || order.name?.split(' ')[0] || 'Customer',
      last_name: last_name || order.name?.split(' ').slice(1).join(' ') || 'Name',
      email: email || order.email,
      host: process.env.NEXTAUTH_URL || 'https://triomarautospares.com'
    }

    // Create card payment session
    const paymentResponse = await intaSendAPI.createCardPaymentSession(cardRequest)

    if (!paymentResponse.success) {
      console.error('Card payment session creation failed:', paymentResponse.error)
      return NextResponse.json({ 
        success: false, 
        error: paymentResponse.error || 'Failed to create card payment session' 
      }, { status: 500 })
    }

    // Store payment session in database
    await db.query(`
      INSERT INTO payment_sessions (order_id, provider, session_data, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (order_id, provider) DO UPDATE SET
        session_data = $3,
        updated_at = NOW()
    `, [order_id, 'intasend_card', JSON.stringify({
      amount: cardRequest.amount,
      currency: cardRequest.currency,
      narrative: cardRequest.narrative,
      account_reference: cardRequest.account_reference,
      intasend_response: paymentResponse.data
    })])

    // Update order status
    await db.query(`
      UPDATE orders 
      SET status = 'payment_pending', 
          payment_method = 'card',
          updated_at = NOW()
      WHERE id = $1
    `, [order_id])

    // Log payment initiation
    await db.query(`
      INSERT INTO payment_logs (order_id, provider, status, transaction_id, response_data, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [order_id, 'intasend_card', 'initiated', paymentResponse.data?.invoice?.invoice_id || null, JSON.stringify(paymentResponse.data)])

    return NextResponse.json({
      success: true,
      message: 'Card payment session created successfully',
      data: {
        order_id: order_id,
        amount: order.final_amount,
        currency: 'KES',
        payment_url: paymentResponse.data?.invoice?.url,
        invoice_id: paymentResponse.data?.invoice?.invoice_id,
        status: 'pending'
      }
    })

  } catch (error: any) {
    console.error('Card payment API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 })
  }
}

/**
 * Check Card Payment Status
 * GET /api/payments/intasend/card?order_id=xxx
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
        if (statusResponse.data.status === 'COMPLETE') {
          newStatus = 'confirmed'
        } else if (statusResponse.data.status === 'FAILED') {
          newStatus = 'payment_failed'
        }

        if (newStatus !== order.status) {
          await db.query(`
            UPDATE orders 
            SET status = $1, 
                payment_transaction_id = $2,
                updated_at = NOW()
            WHERE id = $3
          `, [newStatus, statusResponse.data.invoice_id || order.payment_transaction_id, order_id])
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        order_id: order_id,
        status: order.status,
        payment_method: 'card',
        transaction_id: order.payment_transaction_id
      }
    })

  } catch (error: any) {
    console.error('Card payment status check error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Internal server error' 
    }, { status: 500 })
  }
}
