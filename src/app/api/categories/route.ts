import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
	try {
		const { rows } = await db.query('select id, name, description from categories order by name')
		return NextResponse.json({ ok: true, data: rows })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || 'Failed to load categories' }, { status: 500 })
	}
}


