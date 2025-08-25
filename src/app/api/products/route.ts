import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'

export async function GET() {
	try {
		const { rows: data } = await db.query(`
			SELECT 
				p.id,
				p.name,
				p.price,
				pi.image_url,
				c.name as category_name
			FROM parts p
			LEFT JOIN categories c ON p.category_id = c.id
			LEFT JOIN product_images pi ON p.id = pi.part_id AND pi.is_primary = true
			WHERE p.is_active = true
			LIMIT 24
		`)
		return NextResponse.json({ ok: true, data })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: { message: err?.message || 'Unknown error' } }, { status: 500 })
	}
}

function isAdmin(role?: string) {
	return role === 'admin' || role === 'manager'
}

export async function POST(req: NextRequest) {
	const rawSession = await getServerSession(authOptions as any)
	const session = rawSession as any
	if (!session?.user?.email || !isAdmin(session?.user?.role)) {
		return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
	}
	const body = await req.json()
	const { name, part_number, description, category_id, vehicle_id, price, stock_quantity, is_active = true } = body || {}
	if (!name || !price) return NextResponse.json({ ok: false, error: 'name and price required' }, { status: 400 })
	try {
		const { rows } = await db.query(
			`insert into parts (name, part_number, description, category_id, vehicle_id, price, stock_quantity, is_active)
			 values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
			[name, part_number || null, description || null, category_id || null, vehicle_id || null, price, stock_quantity || 0, is_active]
		)
		return NextResponse.json({ ok: true, data: rows[0] })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || 'Create failed' }, { status: 500 })
	}
}

export async function PUT(req: NextRequest) {
	const rawSession = await getServerSession(authOptions as any)
	const session = rawSession as any
	if (!session?.user?.email || !isAdmin(session?.user?.role)) {
		return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
	}
	const body = await req.json()
	const { id, ...updates } = body || {}
	if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
	const fields = [] as string[]
	const values = [] as any[]
	let idx = 1
	for (const [k, v] of Object.entries(updates)) {
		fields.push(`${k} = $${idx++}`)
		values.push(v)
	}
	values.push(id)
	try {
		const { rows } = await db.query(`update parts set ${fields.join(', ')} where id = $${idx} returning *`, values)
		return NextResponse.json({ ok: true, data: rows[0] })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || 'Update failed' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	const rawSession = await getServerSession(authOptions as any)
	const session = rawSession as any
	if (!session?.user?.email || !isAdmin(session?.user?.role)) {
		return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 })
	}
	const { searchParams } = new URL(req.url)
	const id = searchParams.get('id')
	if (!id) return NextResponse.json({ ok: false, error: 'id required' }, { status: 400 })
	try {
		await db.query('delete from parts where id = $1', [id])
		return NextResponse.json({ ok: true })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || 'Delete failed' }, { status: 500 })
	}
}


