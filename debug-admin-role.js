const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function debugAdminRole() {
  try {
    console.log('Debugging admin role detection...\n');
    
    // Check admin user in users_auth table
    const userAuth = await pool.query(`
      SELECT id, email, name FROM users_auth WHERE email = 'admin@autozone.com'
    `);
    
    if (userAuth.rows.length === 0) {
      console.log('❌ Admin user not found in users_auth table');
      return;
    }
    
    const userId = userAuth.rows[0].id;
    console.log('✅ Admin user found in users_auth:');
    console.log(`  ID: ${userId}`);
    console.log(`  Email: ${userAuth.rows[0].email}`);
    console.log(`  Name: ${userAuth.rows[0].name}`);
    
    // Check if user exists in admin_users table
    const adminUser = await pool.query(`
      SELECT * FROM admin_users WHERE email = 'admin@autozone.com'
    `);
    
    if (adminUser.rows.length === 0) {
      console.log('\n❌ Admin user not found in admin_users table');
      console.log('Creating admin user in admin_users table...');
      
      await pool.query(`
        INSERT INTO admin_users (email, role, first_name, last_name, is_active, created_at, updated_at)
        VALUES ('admin@autozone.com', 'admin', 'Admin', 'User', true, NOW(), NOW())
      `);
      
      console.log('✅ Admin user created in admin_users table');
    } else {
      console.log('\n✅ Admin user found in admin_users table:');
      console.log(`  Role: ${adminUser.rows[0].role}`);
      console.log(`  Active: ${adminUser.rows[0].is_active}`);
    }
    
    // Check the NextAuth callback logic
    console.log('\n🔍 NextAuth Role Detection Logic:');
    console.log('The system looks for:');
    console.log('1. User in users_auth table (for authentication)');
    console.log('2. User in admin_users table (for role)');
    console.log('3. Matches by user_id in admin_users table');
    
    // Check if there's a user_id match
    const roleCheck = await pool.query(`
      SELECT au.role 
      FROM admin_users au 
      WHERE au.user_id = $1
    `, [userId]);
    
    if (roleCheck.rows.length === 0) {
      console.log('\n⚠️  No role found by user_id match');
      console.log('Updating admin_users to link with user_id...');
      
      await pool.query(`
        UPDATE admin_users 
        SET user_id = $1, updated_at = NOW()
        WHERE email = 'admin@autozone.com'
      `, [userId]);
      
      console.log('✅ Admin user linked with user_id');
    } else {
      console.log('\n✅ Role found by user_id match:');
      console.log(`  Role: ${roleCheck.rows[0].role}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

debugAdminRole();
