const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    checkServerIdentity: () => undefined
  }
});

async function seedComprehensiveData() {
  const client = await pool.connect();
  
  try {
    console.log('Starting comprehensive automotive data seeding...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, '../supabase/seeds/003_comprehensive_automotive_data.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          console.error(`✗ Error executing statement ${i + 1}:`, error.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('Comprehensive automotive data seeding completed!');
    
    // Verify the data
    console.log('\nVerifying data...');
    
    const vehicleCount = await client.query('SELECT COUNT(*) FROM vehicles');
    const categoryCount = await client.query('SELECT COUNT(*) FROM categories');
    const partsCount = await client.query('SELECT COUNT(*) FROM parts');
    
    console.log(`Vehicles: ${vehicleCount.rows[0].count}`);
    console.log(`Categories: ${categoryCount.rows[0].count}`);
    console.log(`Parts: ${partsCount.rows[0].count}`);
    
    // Show some sample data
    console.log('\nSample vehicles:');
    const sampleVehicles = await client.query('SELECT name, make, model FROM vehicles LIMIT 5');
    sampleVehicles.rows.forEach(v => console.log(`- ${v.make} ${v.model}`));
    
    console.log('\nSample categories:');
    const sampleCategories = await client.query('SELECT name FROM categories LIMIT 5');
    sampleCategories.rows.forEach(c => console.log(`- ${c.name}`));
    
    console.log('\nSample parts:');
    const sampleParts = await client.query('SELECT name, brand, price FROM parts LIMIT 5');
    sampleParts.rows.forEach(p => console.log(`- ${p.name} (${p.brand}) - KSH ${p.price}`));
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the seeding
seedComprehensiveData().catch(console.error);
