import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Worldpay configuration - replace with your actual credentials
const WORLDPAY_CONFIG = {
  merchantId: process.env.WORLDPAY_MERCHANT_ID || 'your_merchant_id',
  secretKey: process.env.WORLDPAY_SECRET_KEY || 'your_secret_key',
  environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://secure.worldpay.com' 
    : 'https://secure-test.worldpay.com'
}

// Create Worldpay payment session
export async function GET(req: NextRequest) {
  const rawSession = await getServerSession(authOptions as any)
  const session = rawSession as any
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const orderId = searchParams.get('order_id')
  if (!orderId) {
    return NextResponse.json({ ok: false, error: 'order_id required' }, { status: 400 })
  }

  try {
    // Verify order belongs to user and get order details
    const { rows } = await db.query(`
      SELECT o.id, o.final_amount, o.status, u.email, u.name
      FROM orders o 
      JOIN users_auth u ON u.id = o.user_id
      WHERE o.id = $1 AND u.email = $2
    `, [orderId, session.user.email])

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    const order = rows[0]
    
    if (order.status !== 'pending_payment') {
      return NextResponse.json({ ok: false, error: 'Order not ready for payment' }, { status: 400 })
    }

    // Create Worldpay payment session
    const paymentData = {
      merchantId: WORLDPAY_CONFIG.merchantId,
      orderId: orderId,
      amount: Math.round(parseFloat(order.final_amount) * 100), // Convert to pence/cents
      currency: 'GBP',
      customerName: order.name || 'Customer',
      customerEmail: order.email,
      successUrl: `${process.env.NEXTAUTH_URL}/checkout/success?order_id=${orderId}`,
      failureUrl: `${process.env.NEXTAUTH_URL}/checkout/failure?order_id=${orderId}`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/checkout/cancel?order_id=${orderId}`,
      callbackUrl: `${process.env.NEXTAUTH_URL}/api/payments/worldpay/webhook`,
      description: `AutoZone Order #${orderId}`,
      timestamp: Math.floor(Date.now() / 1000)
    }

    // Generate signature for Worldpay
    const signature = generateWorldpaySignature(paymentData, WORLDPAY_CONFIG.secretKey)
    
    // Store payment session in database
    await db.query(`
      INSERT INTO payment_sessions (order_id, provider, session_data, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (order_id) DO UPDATE SET
        session_data = $3,
        updated_at = NOW()
    `, [orderId, 'worldpay', JSON.stringify(paymentData)])

    // Redirect to Worldpay HPP
    const worldpayUrl = `${WORLDPAY_CONFIG.baseUrl}/jsp/payment/pay.jsp`
    const formData = new URLSearchParams()
    
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    formData.append('signature', signature)

    return NextResponse.json({
      ok: true,
      provider: 'worldpay',
      redirectUrl: worldpayUrl,
      formData: Object.fromEntries(formData),
      order_id: orderId
    })

  } catch (error: any) {
    console.error('Worldpay payment initiation error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'Payment initiation failed' 
    }, { status: 500 })
  }
}

// Worldpay webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-worldpay-signature')
    
    // Verify webhook signature
    if (!verifyWorldpayWebhook(body, signature, WORLDPAY_CONFIG.secretKey)) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
    }

    const data = JSON.parse(body)
    const { orderId, paymentStatus, transactionId } = data

    if (!orderId) {
      return NextResponse.json({ ok: false, error: 'Missing orderId' }, { status: 400 })
    }

    // Update order status based on payment result
    let newStatus = 'pending'
    if (paymentStatus === 'SUCCESS' || paymentStatus === 'AUTHORISED') {
      newStatus = 'confirmed'
    } else if (paymentStatus === 'FAILED' || paymentStatus === 'DECLINED') {
      newStatus = 'payment_failed'
    } else if (paymentStatus === 'CANCELLED') {
      newStatus = 'cancelled'
    }

    // Update order status
    await db.query(`
      UPDATE orders 
      SET status = $1, 
          payment_transaction_id = $2,
          updated_at = NOW()
      WHERE id = $3
    `, [newStatus, transactionId || null, orderId])

    // Log payment result
    await db.query(`
      INSERT INTO payment_logs (order_id, provider, status, transaction_id, response_data, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `, [orderId, 'worldpay', paymentStatus, transactionId || null, body])

    return NextResponse.json({ ok: true, status: newStatus })

  } catch (error: any) {
    console.error('Worldpay webhook error:', error)
    return NextResponse.json({ 
      ok: false, 
      error: error?.message || 'Webhook processing failed' 
    }, { status: 500 })
  }
}

function generateWorldpaySignature(data: any, secretKey: string): string {
  const signatureString = [
    data.merchantId,
    data.orderId,
    data.amount,
    data.currency,
    data.timestamp
  ].join('|')
  
  return crypto.createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('hex')
}

function verifyWorldpayWebhook(body: string, signature: string | null, secretKey: string): boolean {
  if (!signature) return false
  
  const expectedSignature = crypto.createHmac('sha256', secretKey)
    .update(body)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  )
}


