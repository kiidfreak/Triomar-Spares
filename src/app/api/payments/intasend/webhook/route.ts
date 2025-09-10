import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { intaSendAPI } from '@/lib/intasend'

/**
 * IntaSend Webhook Handler
 * POST /api/payments/intasend/webhook
 * Handles payment status updates from IntaSend
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-intasend-signature')
    
    // Verify webhook signature (optional but recommended)
    if (signature && !intaSendAPI.verifyWebhookSignature(body, signature)) {
      console.error('Invalid webhook signature')
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid signature' 
      }, { status: 401 })
    }

    const data = JSON.parse(body)
    console.log('IntaSend Webhook received:', data)

    // Extract payment information
    const { 
      invoice_id, 
      api_ref, 
      status, 
      amount, 
      currency, 
      phone_number,
      narrative,
      created_at,
      updated_at 
    } = data

    if (!api_ref) {
      console.error('Missing api_ref in webhook data')
      return NextResponse.json({ 
        success: false, 
        error: 'Missing api_ref' 
      }, { status: 400 })
    }

    // Map IntaSend status to our order status
    let orderStatus = 'pending'
    let paymentStatus = 'pending'
    
    switch (status?.toUpperCase()) {
      case 'COMPLETE':
      case 'COMPLETED':
        orderStatus = 'confirmed'
        paymentStatus = 'completed'
        break
      case 'FAILED':
      case 'FAILURE':
        orderStatus = 'payment_failed'
        paymentStatus = 'failed'
        break
      case 'PENDING':
        orderStatus = 'payment_pending'
        paymentStatus = 'pending'
        break
      case 'CANCELLED':
        orderStatus = 'cancelled'
        paymentStatus = 'cancelled'
        break
      default:
        console.log('Unknown payment status:', status)
        orderStatus = 'payment_pending'
        paymentStatus = 'pending'
    }

    // Update order status
    const updateResult = await db.query(`
      UPDATE orders 
      SET status = $1, 
          payment_transaction_id = $2,
          updated_at = NOW()
      WHERE id = $3
    `, [orderStatus, invoice_id || null, api_ref])

    if (updateResult.rowCount === 0) {
      console.error(`Order not found for api_ref: ${api_ref}`)
      return NextResponse.json({ 
        success: false, 
        error: 'Order not found' 
      }, { status: 404 })
    }

    // Log payment result
    await db.query(`
      INSERT INTO payment_logs (order_id, provider, status, transaction_id, response_data, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [api_ref, 'intasend', paymentStatus, invoice_id || null, body])

    // Update payment session
    await db.query(`
      UPDATE payment_sessions 
      SET session_data = jsonb_set(
        COALESCE(session_data, '{}'::jsonb), 
        '{webhook_data}', 
        $1::jsonb
      ),
      updated_at = NOW()
      WHERE order_id = $2
    `, [JSON.stringify(data), api_ref])

    // If payment is successful, you might want to:
    // 1. Send confirmation email
    // 2. Update inventory
    // 3. Trigger fulfillment process
    if (orderStatus === 'confirmed') {
      console.log(`Payment successful for order ${api_ref}`)
      
      // You can add additional logic here for successful payments
      // For example:
      // - Send confirmation email
      // - Update inventory levels
      // - Trigger order fulfillment
      // - Send SMS notification
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook processed successfully' 
    })

  } catch (error: any) {
    console.error('IntaSend webhook error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error?.message || 'Webhook processing failed' 
    }, { status: 500 })
  }
}

/**
 * Handle GET requests (for webhook verification)
 * GET /api/payments/intasend/webhook
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const challenge = searchParams.get('challenge')
  
  if (challenge) {
    // Return challenge for webhook verification
    return NextResponse.json({ 
      success: true, 
      challenge: challenge 
    })
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'IntaSend webhook endpoint is active' 
  })
}
