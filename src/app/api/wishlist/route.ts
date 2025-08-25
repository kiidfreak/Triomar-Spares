import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import db from '@/lib/db'

export async function GET() {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	const { rows } = await db.query(
		`select w.part_id, p.name, p.price
		 from wishlist w
		 join users_auth u on u.id = w.user_id
		 join parts p on p.id = w.part_id
		 where u.email = $1`,
		[session.user.email]
	)
	return NextResponse.json({ ok: true, items: rows })
}

export async function POST(req: NextRequest) {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	const body = await req.json()
	const { part_id } = body || {}
	if (!part_id) return NextResponse.json({ ok: false, error: 'part_id required' }, { status: 400 })
	const { rows } = await db.query('select id from users_auth where email = $1 limit 1', [session.user.email])
	const userId = rows[0]?.id
	if (!userId) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
	await db.query(
		`insert into wishlist (user_id, part_id) values ($1, $2) on conflict do nothing`,
		[userId, part_id]
	)
	return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	const { searchParams } = new URL(req.url)
	const partId = searchParams.get('part_id')
	if (!partId) return NextResponse.json({ ok: false, error: 'part_id required' }, { status: 400 })
	const { rows } = await db.query('select id from users_auth where email = $1 limit 1', [session.user.email])
	const userId = rows[0]?.id
	await db.query('delete from wishlist where user_id = $1 and part_id = $2', [userId, partId])
	return NextResponse.json({ ok: true })
}


