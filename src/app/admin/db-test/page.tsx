import { NextResponse } from 'next/server'
import db from '@/lib/db'

export default async function DbTestPage() {
	try {
		// Test basic connection
		const { rows } = await db.query('SELECT 1 as test, version() as pg_version')
		
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<h2 className="text-lg font-semibold text-green-800 mb-2">✅ Connection Successful</h2>
					<pre className="bg-white p-3 rounded border text-sm overflow-auto">
						{JSON.stringify(rows[0], null, 2)}
					</pre>
				</div>
			</div>
		)
	} catch (err: any) {
		return (
			<div className="p-8">
				<h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<h2 className="text-lg font-semibold text-red-800 mb-2">❌ Connection Failed</h2>
					<div className="space-y-2">
						<p><strong>Error:</strong> {err.message}</p>
						<p><strong>Type:</strong> {err.constructor.name}</p>
						{err.code && <p><strong>Code:</strong> {err.code}</p>}
						{err.detail && <p><strong>Detail:</strong> {err.detail}</p>}
						{err.hint && <p><strong>Hint:</strong> {err.hint}</p>}
					</div>
					<div className="mt-4 p-3 bg-gray-100 rounded">
						<h3 className="font-semibold mb-2">Environment Check:</h3>
						<ul className="text-sm space-y-1">
							<li>DATABASE_URL: {process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}</li>
							<li>PGSSL: {process.env.PGSSL || 'Not set'}</li>
							<li>NODE_ENV: {process.env.NODE_ENV}</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
