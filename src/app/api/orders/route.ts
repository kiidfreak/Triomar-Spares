import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import { db } from '@/lib/db'
import { getPaymentUrl } from '@/lib/payment-links'

export async function GET() {
	const session = await getServerSession(authOptions as any) as any
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
	const session = await getServerSession(authOptions as any) as any
	// Allow both authenticated and unauthenticated users to create orders
	const userEmail = session?.user?.email || null

	const body = await req.json()
	const { 
		items, 
		payment_method, 
		shipping_info, 
		billing_info, 
		shipping_method 
	} = body || {}
	
	if (!Array.isArray(items) || items.length === 0) {
		return NextResponse.json({ ok: false, error: 'Items required' }, { status: 400 })
	}

	if (!shipping_info || !shipping_info.firstName || !shipping_info.lastName || !shipping_info.email) {
		return NextResponse.json({ ok: false, error: 'Shipping information is required' }, { status: 400 })
	}

	// Create order and items in a transaction
	const pool = await import('@/lib/db').then(m => m.default())
	const client = await pool.connect()
	try {
		await client.query('BEGIN')
		// Get user ID (if authenticated)
		let userId = null
		if (userEmail) {
			const { rows: userRows } = await client.query('select id from users_auth where email = $1 limit 1', [userEmail])
			userId = userRows[0]?.id
		}

		// Prepare shipping and billing addresses
		const shippingAddress = `${shipping_info.address}, ${shipping_info.city}, ${shipping_info.postalCode}, ${shipping_info.country}`
		const billingAddress = billing_info.sameAsShipping 
			? shippingAddress 
			: `${billing_info.address}, ${billing_info.city}, ${billing_info.postalCode}, ${billing_info.country}`

		// Generate order number
		const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

		const initialStatus = payment_method === 'cod' ? 'pending' : 'pending_payment'
		const { rows: orderRows } = await client.query(`
			insert into orders (
				user_id, 
				order_number,
				status, 
				payment_method,
				shipping_method,
				shipping_address,
				billing_address,
				total_amount, 
				final_amount
			) values ($1, $2, $3, $4, $5, $6, $7, 0, 0) returning id, status
		`, [
			userId, 
			orderNumber,
			initialStatus, 
			payment_method,
			shipping_method || 'standard',
			shippingAddress,
			billingAddress
		])
		
		// Debug: Log the created order status
		console.log('Order created with status:', orderRows[0].status, 'Expected:', initialStatus)
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
		
		// Verify order status after trigger execution
		const { rows: statusCheck } = await client.query('SELECT status FROM orders WHERE id = $1', [orderId])
		console.log('Order status after trigger:', statusCheck[0].status)
		
		// Ensure status is still correct for payment methods
		if (payment_method !== 'cod' && statusCheck[0].status !== 'pending_payment') {
			console.log('Fixing order status after trigger...')
			await client.query('UPDATE orders SET status = $1 WHERE id = $2', ['pending_payment', orderId])
		}

		// Clear server-side cart now that items are in an order (if table exists)
		try {
			await client.query('delete from shopping_cart where user_id = $1', [userId])
		} catch (error) {
			// shopping_cart table might not exist yet, that's okay
			console.log('Note: shopping_cart table does not exist, skipping cart cleanup')
		}

		await client.query('COMMIT')

		// Generate payment link
		const paymentUrl = getPaymentUrl(orderId)

		// Handle different payment methods
		if (payment_method === 'card' || payment_method === 'mpesa' || payment_method === 'googlepay') {
			return NextResponse.json({
				ok: true,
				order_id: orderId,
				order_number: orderNumber,
				payment_url: paymentUrl,
				payment: {
					provider: 'intasend',
					payment_method: payment_method,
					redirectUrl: `/checkout/payment?order_id=${orderId}`
				}
			})
		}

		// Legacy Worldpay support
		if (payment_method === 'worldpay') {
			return NextResponse.json({
				ok: true,
				order_id: orderId,
				order_number: orderNumber,
				payment_url: paymentUrl,
				payment: {
					provider: 'worldpay',
					redirectUrl: `/api/payments/worldpay?order_id=${orderId}`
				}
			})
		}

		// Cash/bank transfer flows
		await db.query('update orders set status = $2 where id = $1', [orderId, 'confirmed'])
		return NextResponse.json({ 
			ok: true, 
			order_id: orderId,
			order_number: orderNumber,
			payment_url: paymentUrl,
			message: 'Order created successfully'
		})
	} catch (e: any) {
		await client.query('ROLLBACK')
		return NextResponse.json({ ok: false, error: e?.message || 'Order creation failed' }, { status: 500 })
	} finally {
		client.release()
	}
}


