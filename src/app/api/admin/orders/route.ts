import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import db from '@/lib/db'

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

    // Get orders with customer information
    const { rows: orders } = await db.query(`
      SELECT 
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        up.first_name,
        up.last_name,
        up.phone,
        ua.email,
        COUNT(oi.id) as items_count
      FROM orders o
      LEFT JOIN user_profiles up ON o.user_id = up.user_id
      LEFT JOIN users_auth ua ON o.user_id = ua.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id, o.total_amount, o.status, o.created_at, up.first_name, up.last_name, up.phone, ua.email
      ORDER BY o.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const formattedOrders = orders.map(order => ({
      id: order.id,
      customer_name: order.first_name && order.last_name 
        ? `${order.first_name} ${order.last_name}` 
        : 'Unknown Customer',
      customer_email: order.email || 'No email',
      customer_phone: order.phone || 'No phone',
      items_count: parseInt(order.items_count || '0'),
      total_amount: parseFloat(order.total_amount || '0'),
      status: order.status || 'pending',
      created_at: order.created_at
    }))

    return NextResponse.json({ ok: true, data: formattedOrders })
  } catch (err: any) {
    console.error('Error fetching admin orders:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}
