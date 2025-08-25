import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/nextauth'
import db from '@/lib/db'

export async function GET() {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	const { rows } = await db.query(
		`select u.id, u.email, coalesce(u.name, '') as name,
			coalesce(up.first_name, '') as first_name, coalesce(up.last_name, '') as last_name,
			coalesce(up.phone, '') as phone, coalesce(up.address, '') as address,
			coalesce(up.city, '') as city, coalesce(up.postcode, '') as postcode, coalesce(up.country, '') as country
		 from users_auth u
		 left join user_profiles up on up.id = u.id
		 where u.email = $1
		 limit 1`,
		[session.user.email]
	)
	return NextResponse.json({ ok: true, profile: rows[0] || null })
}

export async function PUT(req: NextRequest) {
	const session = await getServerSession(authOptions as any)
	if (!session?.user?.email) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
	const body = await req.json()
	const { first_name, last_name, phone, address, city, postcode, country, name } = body || {}
	const { rows } = await db.query('select id from users_auth where email = $1 limit 1', [session.user.email])
	const userId = rows[0]?.id
	if (!userId) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })

	await db.query(
		`insert into user_profiles (id, first_name, last_name, phone, address, city, postcode, country)
		 values ($1, $2, $3, $4, $5, $6, $7, $8)
		 on conflict (id) do update set
		 first_name = excluded.first_name,
		 last_name = excluded.last_name,
		 phone = excluded.phone,
		 address = excluded.address,
		 city = excluded.city,
		 postcode = excluded.postcode,
		 country = excluded.country`,
		[userId, first_name || null, last_name || null, phone || null, address || null, city || null, postcode || null, country || null]
	)

	if (typeof name === 'string' && name.length > 0) {
		await db.query('update users_auth set name = $2 where id = $1', [userId, name])
	}

	return NextResponse.json({ ok: true })
}


