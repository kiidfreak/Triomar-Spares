import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import db from '@/lib/db'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { email, password, name } = body || {}
		if (!email || !password) {
			return NextResponse.json({ ok: false, error: 'Email and password are required' }, { status: 400 })
		}
		const passwordHash = await hash(password, 10)
		const { rows } = await db.query(
			'insert into users_auth (email, password_hash, name) values ($1, $2, $3) returning id, email, name, created_at',
			[email, passwordHash, name || null]
		)
		return NextResponse.json({ ok: true, user: rows[0] })
	} catch (err: any) {
		if (err?.code === '23505') {
			return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 })
		}
		return NextResponse.json({ ok: false, error: err?.message || 'Registration failed' }, { status: 500 })
	}
}
