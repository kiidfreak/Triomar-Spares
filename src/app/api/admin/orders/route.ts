import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ ok: false, error: { message: 'Unauthorized' } }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.json({ ok: false, error: { message: 'Insufficient permissions' } }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Get orders with customer information and payment details
    const { rows: orders } = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.final_amount,
        o.status,
        o.payment_transaction_id,
        o.payment_method,
        o.payment_status,
        o.created_at,
        o.updated_at,
        up.first_name,
        up.last_name,
        up.phone,
        ua.email,
        ps.provider as session_payment_method,
        ps.session_data,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN payment_sessions ps ON o.id = ps.order_id
      GROUP BY o.id, o.total_amount, o.final_amount, o.status, o.payment_transaction_id, o.payment_method, o.payment_status, o.created_at, o.updated_at, up.first_name, up.last_name, up.phone, ua.email, ps.provider, ps.session_data
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const formattedOrders = orders.map(order => {
      // Extract payment information from session_data
      let sessionPaymentStatus = null
      let sessionPaymentMethod = null
      
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

      return {
        id: order.id,
        customer_name: order.first_name && order.last_name 
          ? `${order.first_name} ${order.last_name}` 
          : 'Unknown Customer',
        customer_email: order.email || 'No email',
        customer_phone: order.phone || 'No phone',
        items_count: parseInt(order.items_count || '0'),
        total_amount: parseFloat(order.total_amount || '0'),
        final_amount: parseFloat(order.final_amount || order.total_amount || '0'),
        status: finalPaymentStatus,
        payment_method: order.payment_method || sessionPaymentMethod || null,
        payment_status: sessionPaymentStatus || order.payment_status || finalPaymentStatus,
        payment_transaction_id: order.payment_transaction_id || null,
        created_at: order.created_at,
        updated_at: order.updated_at
      }
    })

    return NextResponse.json({ ok: true, data: formattedOrders })
  } catch (err: any) {
    console.error('Error fetching admin orders:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}
