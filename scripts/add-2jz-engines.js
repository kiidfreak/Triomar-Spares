const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

async function add2JZEngines() {
  const client = await pool.connect()
  
  try {
    console.log('🚀 Adding 2JZ Engine products to database...')
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '010_add_2jz_engines.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Execute the migration
    await client.query(migrationSQL)
    
    console.log('✅ Successfully added 2JZ Engine products to database!')
    console.log('📦 Added products:')
    console.log('   - Toyota 2JZ-GTE Engine - Complete (KSH 89,999)')
    console.log('   - Toyota 2JZ Long Motor (KSH 45,999)')
    console.log('   - Toyota 2JZ Engine - Used (KSH 29,999)')
    
  } catch (error) {
    console.error('❌ Error adding 2JZ engines:', error.message)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// Run the migration
add2JZEngines()
  .then(() => {
    console.log('🎉 Migration completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  })
