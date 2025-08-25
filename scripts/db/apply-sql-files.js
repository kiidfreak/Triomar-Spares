/*
  Usage:
    DATABASE_URL=postgresql://... node scripts/db/apply-sql-files.js supabase/migrations supabase/seeds

  Applies all .sql files in each provided directory (in lexicographic order).
*/

const fs = require('fs')
const path = require('path')
const { Client } = require('pg')
const dotenv = require('dotenv')

// Load .env.local if present
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
	dotenv.config({ path: envLocalPath })
} else {
	dotenv.config()
}

function isSqlFile(p) {
	return p.toLowerCase().endsWith('.sql')
}

async function listSqlTargets(inputPath) {
	const abs = path.resolve(process.cwd(), inputPath)
	if (!fs.existsSync(abs)) {
		throw new Error(`Path not found: ${inputPath}`)
	}
	const stat = fs.statSync(abs)
	if (stat.isFile()) {
		if (!isSqlFile(abs)) throw new Error(`Not an .sql file: ${inputPath}`)
		return [{ name: path.basename(abs), fullPath: abs }]
	}
	const files = fs
		.readdirSync(abs)
		.filter((f) => isSqlFile(f))
		.sort()
	return files.map((f) => ({ name: f, fullPath: path.join(abs, f) }))
}

async function applyFile(client, file) {
	const sql = fs.readFileSync(file.fullPath, 'utf8')
	if (!sql.trim()) return
	console.log(`\n→ Applying ${file.name}`)
	await client.query('BEGIN')
	try {
		await client.query(sql)
		await client.query('COMMIT')
		console.log(`✓ Applied ${file.name}`)
	} catch (err) {
		await client.query('ROLLBACK')
		console.error(`✗ Failed ${file.name}:`, err.message)
		throw err
	}
}

async function main() {
	const databaseUrl = process.env.DATABASE_URL
	if (!databaseUrl) {
		console.error('DATABASE_URL is not set. Set it in your environment or .env.local')
		process.exit(1)
	}

	const dirs = process.argv.slice(2)
	if (dirs.length === 0) {
		console.error('Provide at least one directory of .sql files to apply')
		process.exit(1)
	}

	const client = new Client({ connectionString: databaseUrl, ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined })
	await client.connect()

	try {
		for (const target of dirs) {
			const statPath = path.resolve(process.cwd(), target)
			const stat = fs.existsSync(statPath) ? fs.statSync(statPath) : null
			console.log(`\n=== Applying SQL ${stat?.isFile() ? 'file' : 'files from'}: ${target} ===`)
			const files = await listSqlTargets(target)
			for (const file of files) await applyFile(client, file)
		}
		console.log('\nAll files applied successfully.')
	} finally {
		await client.end()
	}
}

main().catch((err) => {
	console.error('\nAborted due to error:', err.message)
	process.exit(1)
})


