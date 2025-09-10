import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'
import { generatePaymentLink } from '@/lib/payment-links'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any) as any
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { orderId, expiresIn } = body

    if (!orderId) {
      return NextResponse.json({ ok: false, error: 'Order ID is required' }, { status: 400 })
    }

    // Verify the order exists and belongs to the user
    const { rows: orderRows } = await db.query(`
      SELECT o.id, o.final_amount, o.status
      FROM orders o
      JOIN users_auth u ON o.user_id = u.id
      WHERE o.id = $1 AND u.email = $2
    `, [orderId, session.user.email])

    if (orderRows.length === 0) {
      return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
    }

    const order = orderRows[0]

    // Generate payment link
    const paymentLink = generatePaymentLink({
      orderId: order.id,
      amount: order.final_amount,
      expiresIn: expiresIn || 24 // Default 24 hours
    })

    return NextResponse.json({
      ok: true,
      paymentLink,
      order: {
        id: order.id,
        amount: order.final_amount,
        status: order.status
      }
    })
  } catch (error: any) {
    console.error('Error generating payment link:', error)
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to generate payment link' },
      { status: 500 }
    )
  }
}
