import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import db from '@/lib/db'

export async function GET() {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

	// Fetch orders for the authenticated user
	const { rows } = await db.query(
		`select o.id, o.order_number, o.status, o.total_amount, o.final_amount, o.created_at
		 from orders o
		 where o.user_id = (select id from users_auth where email = $1 limit 1)
		 order by o.created_at desc
		 limit 50`,
		[session.user.email]
	)
	return NextResponse.json({ ok: true, data: rows })
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })

	const body = await req.json()
	const { items, payment_method } = body || {}
	if (!Array.isArray(items) || items.length === 0) {
		return NextResponse.json({ ok: false, error: 'Items required' }, { status: 400 })
	}

	// Create order and items in a transaction
	const client = await (db as any).connect()
	try {
		await client.query('BEGIN')
		const { rows: userRows } = await client.query('select id from users_auth where email = $1 limit 1', [session.user.email])
		const userId = userRows[0]?.id
		if (!userId) throw new Error('User not found')

		const initialStatus = payment_method === 'cod' ? 'pending' : 'pending_payment'
		const { rows: orderRows } = await client.query(
			'insert into orders (user_id, status, total_amount, final_amount) values ($1, $2, 0, 0) returning id',
			[userId, initialStatus]
		)
		const orderId = orderRows[0].id

		for (const it of items) {
			if (!it.part_id || !it.quantity) throw new Error('Invalid item')
			const { rows: partRows } = await client.query('select price from parts where id = $1', [it.part_id])
			if (partRows.length === 0) throw new Error('Part not found')
			const unitPrice = partRows[0].price
			const totalPrice = Number(unitPrice) * Number(it.quantity)
			await client.query(
				'insert into order_items (order_id, part_id, quantity, unit_price, total_price) values ($1, $2, $3, $4, $5)',
				[orderId, it.part_id, it.quantity, unitPrice, totalPrice]
			)
		}

		// Trigger calculates totals via existing trigger after items inserted

		// Clear server-side cart now that items are in an order
		await client.query('delete from shopping_cart where user_id = $1', [userId])

		await client.query('COMMIT')

		// If using Worldpay (or any online payment), return a placeholder payment initiation
		if (payment_method === 'card' || payment_method === 'worldpay') {
			return NextResponse.json({
				ok: true,
				order_id: orderId,
				payment: {
					provider: 'worldpay',
					redirectUrl: `/api/payments/worldpay?order_id=${orderId}`
				}
			})
		}

		// Cash/bank transfer flows
		await db.query('update orders set status = $2 where id = $1', [orderId, 'confirmed'])
		return NextResponse.json({ ok: true, order_id: orderId })
	} catch (e: any) {
		await client.query('ROLLBACK')
		return NextResponse.json({ ok: false, error: e?.message || 'Order creation failed' }, { status: 500 })
	} finally {
		client.release()
	}
}


