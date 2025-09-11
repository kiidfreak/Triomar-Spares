const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function applyMigration() {
  try {
    console.log('Applying order total calculation trigger migration...');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync('supabase/migrations/011_add_order_total_calculation_trigger.sql', 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Migration applied successfully!');
    
    // Verify the trigger was created
    const triggerResult = await pool.query(`
      SELECT trigger_name, event_manipulation, action_statement 
      FROM information_schema.triggers 
      WHERE event_object_table = 'order_items' AND trigger_name LIKE '%calculate_order_total%'
    `);
    
    console.log('Created triggers:');
    console.log(JSON.stringify(triggerResult.rows, null, 2));
    
    // Verify the function was created
    const functionResult = await pool.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_name = 'calculate_order_total'
    `);
    
    console.log('Created function:');
    console.log(JSON.stringify(functionResult.rows, null, 2));
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await pool.end();
  }
}

applyMigration();
