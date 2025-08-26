import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
	try {
		const { rows } = await db.query('select 1 as ok')
		return NextResponse.json({ ok: true, result: rows[0]?.ok === 1 })
	} catch (err: any) {
		return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 })
	}
}


