import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id

    // Get order with customer information and payment details
    const { rows: orders } = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.final_amount,
        o.status,
        o.payment_transaction_id,
        o.payment_method,
        o.payment_status,
        o.shipping_address,
        o.billing_address,
        o.notes,
        o.created_at,
        o.updated_at,
        up.first_name,
        up.last_name,
        up.phone,
        ua.email,
        ua.name,
        ps.provider as session_payment_method,
        ps.session_data
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN payment_sessions ps ON o.id = ps.order_id
      WHERE o.id = $1
    `, [orderId])

    if (orders.length === 0) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orders[0]

    // Extract payment information from session_data
    let sessionPaymentStatus = null
    let sessionPaymentMethod = null
    let sessionPhoneNumber = null
    
    if (order.session_data) {
      try {
        const sessionData = typeof order.session_data === 'string' 
          ? JSON.parse(order.session_data) 
          : order.session_data
        
        // Get payment status from webhook data (most reliable)
        if (sessionData.webhook_data?.state) {
          sessionPaymentStatus = sessionData.webhook_data.state
        } else if (sessionData.intasend_response?.invoice?.state) {
          sessionPaymentStatus = sessionData.intasend_response.invoice.state
        }
        
        // Get payment method from provider
        if (order.session_payment_method) {
          sessionPaymentMethod = order.session_payment_method.replace('intasend_', '')
        }
        
        // Get phone number from payment session
        if (sessionData.phone_number) {
          sessionPhoneNumber = sessionData.phone_number
        }
      } catch (error) {
        console.error('Error parsing session_data:', error)
      }
    }

    // Determine the most accurate payment status
    let finalPaymentStatus = order.status || 'pending'
    
    // Prioritize webhook state for payment status
    if (sessionPaymentStatus) {
      if (sessionPaymentStatus === 'FAILED') {
        finalPaymentStatus = 'payment_failed'
      } else if (sessionPaymentStatus === 'COMPLETE' || sessionPaymentStatus === 'COMPLETED') {
        finalPaymentStatus = 'confirmed'
      } else if (sessionPaymentStatus === 'PENDING') {
        finalPaymentStatus = 'payment_pending'
      }
    }

    // Get customer name from users_auth.name or user_profiles
    let customerName = 'Unknown Customer'
    if (order.name) {
      customerName = order.name
    } else if (order.first_name && order.last_name) {
      customerName = `${order.first_name} ${order.last_name}`
    }

    // Get order items
    const { rows: items } = await db.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        p.name as part_name,
        p.part_number,
        p.brand,
        c.name as category_name
      FROM order_items oi
      LEFT JOIN parts p ON oi.part_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE oi.order_id = $1
    `, [orderId])


    const formattedOrder = {
      id: order.id,
      customer_name: customerName,
      customer_email: order.email || 'No email',
      customer_phone: order.phone || sessionPhoneNumber || 'No phone',
      total_amount: parseFloat(order.total_amount || '0'),
      final_amount: parseFloat(order.final_amount || order.total_amount || '0'),
      status: finalPaymentStatus,
      payment_method: order.payment_method || sessionPaymentMethod || null,
      payment_status: sessionPaymentStatus || order.payment_status || finalPaymentStatus,
      payment_transaction_id: order.payment_transaction_id || null,
      shipping_address: order.shipping_address || null,
      billing_address: order.billing_address || null,
      notes: order.notes || null,
      created_at: order.created_at,
      updated_at: order.updated_at,
      items: items.map(item => ({
        id: item.id,
        part_name: item.part_name || 'Unknown Part',
        part_number: item.part_number || 'N/A',
        quantity: parseInt(item.quantity || '0') || 0,
        unit_price: parseFloat(item.unit_price || '0') || 0,
        total_price: parseFloat(item.total_price || '0') || 0,
        brand: item.brand || 'N/A',
        category_name: item.category_name || 'N/A'
      }))
    }

    console.log('Formatted order:', formattedOrder)

    return NextResponse.json({ ok: true, data: formattedOrder })
  } catch (err: any) {
    console.error('Error fetching order:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
