import { Pool, PoolConfig } from 'pg'

let pool: Pool | null = null

function createPool(): Pool {
	if (!process.env.DATABASE_URL) {
		console.error('DATABASE_URL environment variable is not set')
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

function getPool(): Pool {
	if (!pool) {
		pool = createPool()
	}
	return pool
}

// Check if we're in a build context (Next.js build time)
const isBuildTime = () => {
	// Check if we're in a build environment
	const isBuildEnv = process.env.NODE_ENV === 'production' && 
					   typeof window === 'undefined' && 
					   process.env.VERCEL === '1'
	
	// Check if DATABASE_URL is missing (which would cause build failure)
	const isMissingDbUrl = !process.env.DATABASE_URL
	
	// Check if we're in Next.js build process
	const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build'
	
	return isBuildEnv && (isMissingDbUrl || isNextBuild)
}

export const db = {
	query: async (text: string, params?: any[]) => {
		// During build time when DATABASE_URL is not available, return mock data
		if (isBuildTime()) {
			console.warn('Database query called during build time, returning mock data')
			return { rows: [], rowCount: 0 }
		}

		// Only create pool when actually needed (lazy initialization)
		try {
			return await getPool().query(text, params)
		} catch (error) {
			console.error('Database query error:', error)
			throw error
		}
	}
}

// Export the function, not the result
export default getPool


