const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function checkAdminUser() {
  try {
    console.log('Checking admin user account...\n');
    
    // Check if admin user exists
    const result = await pool.query(`
      SELECT 
        id,
        email,
        name,
        role,
        is_active,
        created_at,
        updated_at
      FROM users 
      WHERE email = 'admin@autozone.com'
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Admin user not found in database');
      console.log('Creating admin user...');
      
      // Create admin user
      const createResult = await pool.query(`
        INSERT INTO users (email, name, role, is_active, created_at, updated_at)
        VALUES ('admin@autozone.com', 'Admin User', 'admin', true, NOW(), NOW())
        RETURNING id, email, name, role, is_active
      `);
      
      console.log('✅ Admin user created successfully:');
      console.log(createResult.rows[0]);
      
    } else {
      const admin = result.rows[0];
      console.log('✅ Admin user found:');
      console.log(`  ID: ${admin.id}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Role: ${admin.role}`);
      console.log(`  Active: ${admin.is_active}`);
      console.log(`  Created: ${admin.created_at}`);
      console.log(`  Updated: ${admin.updated_at}`);
      
      // Check if user is active
      if (!admin.is_active) {
        console.log('\n⚠️  Admin user is inactive. Activating...');
        await pool.query(`
          UPDATE users 
          SET is_active = true, updated_at = NOW()
          WHERE email = 'admin@autozone.com'
        `);
        console.log('✅ Admin user activated');
      }
    }
    
    // Check all users with admin role
    const allAdmins = await pool.query(`
      SELECT email, name, role, is_active
      FROM users 
      WHERE role = 'admin'
      ORDER BY created_at
    `);
    
    console.log('\n📋 All admin users:');
    allAdmins.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.name}) - Active: ${user.is_active}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAdminUser();
