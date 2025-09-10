import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId

    // Fetch order details
    const { rows: orderRows } = await db.query(`
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.final_amount,
        o.payment_method,
        o.shipping_address,
        o.created_at
      FROM orders o
      WHERE o.id = $1
    `, [orderId])

    if (orderRows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orderRows[0]

    // Fetch order items
    const { rows: itemRows } = await db.query(`
      SELECT 
        oi.id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        p.name,
        p.image_url
      FROM order_items oi
      JOIN parts p ON oi.part_id = p.id
      WHERE oi.order_id = $1
    `, [orderId])

    // Format items
    const items = itemRows.map(item => ({
      id: item.id,
      name: item.name,
      price: `KSH ${Number(item.unit_price).toLocaleString()}`,
      quantity: item.quantity,
      image: item.image_url || '/images/placeholder.svg'
    }))

    const orderDetails = {
      ...order,
      items
    }

    return NextResponse.json({ ok: true, data: orderDetails })
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ ok: false, error: 'Status is required' }, { status: 400 })
    }

    // Update order status
    const { rows } = await db.query(`
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, status
    `, [status, orderId])

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: rows[0] })
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}
