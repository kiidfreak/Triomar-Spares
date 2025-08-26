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

    // Get total orders and revenue
    const { rows: orderStats } = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
    `)

    // Get total customers (unique users who have placed orders)
    const { rows: customerStats } = await db.query(`
      SELECT COUNT(DISTINCT user_id) as total_customers
      FROM orders
      WHERE user_id IS NOT NULL
    `)

    // Get total products
    const { rows: productStats } = await db.query(`
      SELECT COUNT(*) as total_products
      FROM parts
    `)



    const stats = {
      totalOrders: parseInt(orderStats[0]?.total_orders || '0'),
      totalRevenue: parseFloat(orderStats[0]?.total_revenue || '0'),
      totalCustomers: parseInt(customerStats[0]?.total_customers || '0'),
      totalProducts: parseInt(productStats[0]?.total_products || '0')
    }



    return NextResponse.json({ ok: true, data: stats })
  } catch (err: any) {
    console.error('Error fetching admin stats:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}
