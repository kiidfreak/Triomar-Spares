import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import db from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
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

    // Get products with category information, vehicle information, and sales data
    const { rows: products } = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.part_number,
        p.description,
        p.brand,
        p.stock_quantity,
        p.price,
        p.warranty_months,
        p.is_active,
        p.created_at,
        c.name as category_name,
        v.name as vehicle_name,
        v.make as vehicle_make,
        v.model as vehicle_model,
        COALESCE(SUM(oi.quantity), 0) as sales_count,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) as revenue
      FROM parts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN vehicles v ON p.vehicle_id = v.id
      LEFT JOIN order_items oi ON p.id = oi.part_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.status IN ('confirmed', 'shipped', 'delivered')
      GROUP BY p.id, p.name, p.part_number, p.description, p.brand, p.stock_quantity, p.price, p.warranty_months, p.is_active, p.created_at, c.name, v.name, v.make, v.model
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset])

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      part_number: product.part_number,
      description: product.description,
      category_name: product.category_name || 'Uncategorized',
      vehicle_name: product.vehicle_name,
      vehicle_make: product.vehicle_make,
      vehicle_model: product.vehicle_model,
      brand: product.brand,
      sales_count: parseInt(product.sales_count || '0'),
      revenue: parseFloat(product.revenue || '0'),
      stock_quantity: parseInt(product.stock_quantity || '0'),
      price: parseFloat(product.price || '0'),
      warranty_months: parseInt(product.warranty_months || '0'),
      is_active: product.is_active,
      created_at: product.created_at
    }))

    return NextResponse.json({ ok: true, data: formattedProducts })
  } catch (err: any) {
    console.error('Error fetching admin products:', err)
    return NextResponse.json(
      { ok: false, error: { message: err?.message || 'Unknown error' } },
      { status: 500 }
    )
  }
}
