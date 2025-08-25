import { Pool, PoolConfig } from 'pg'

let pool: Pool | null = null

function createPool(): Pool {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set')
	}

	// Validate and normalize the connection string
	let connectionString = process.env.DATABASE_URL
	try {
		// Throws if malformed
		// eslint-disable-next-line no-new
		new URL(connectionString)
	} catch {
		throw new Error('DATABASE_URL is malformed. Expect format: postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require')
	}

	// Force Node.js to accept self-signed certificates
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

	const config: PoolConfig = { connectionString }

	// Detect if URL already requests SSL
	const hasSslModeRequire = /([?&])sslmode=require(\b|&)/i.test(connectionString!)
	const hostname = new URL(connectionString!).hostname

	// Enable SSL in production or when explicitly requested. Railway typically requires SSL.
	const shouldEnableSsl =
		process.env.PGSSL === 'true' || process.env.NODE_ENV === 'production' || hasSslModeRequire

	if (shouldEnableSsl) {
		// Ensure sslmode=require in the URL if not already present
		if (!/([?&])sslmode=/.test(connectionString!)) {
			connectionString += (connectionString!.includes('?') ? '&' : '?') + 'sslmode=require'
			config.connectionString = connectionString
		}
		
		// CRITICAL: Set SSL config at Pool level to handle self-signed certs
		config.ssl = { 
			rejectUnauthorized: false,
			// Additional SSL options for Railway compatibility
			checkServerIdentity: () => undefined
		}
	}

	return new Pool(config)
}

export function getPool(): Pool {
	if (!pool) {
		pool = createPool()
	}
	return pool
}

export default getPool()


