#!/usr/bin/env node

/**
 * Check available parts in the database
 * Run with: node scripts/check-parts.js
 */

const { Pool } = require('pg');

async function checkParts() {
  console.log('🔍 Checking available parts in database...\n');

  const DATABASE_URL = 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Get all parts with their details
    const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.part_number,
        p.price,
        p.stock_quantity,
        c.name as category,
        v.name as vehicle
      FROM parts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN vehicles v ON p.vehicle_id = v.id
      WHERE p.is_active = true
      ORDER BY p.name
      LIMIT 10
    `);

    if (rows.length === 0) {
      console.log('❌ No parts found in database');
      console.log('📝 You may need to seed the database with sample data');
    } else {
      console.log(`✅ Found ${rows.length} parts in database:\n`);
      
      rows.forEach((part, index) => {
        console.log(`${index + 1}. ${part.name}`);
        console.log(`   ID: ${part.id}`);
        console.log(`   Part Number: ${part.part_number || 'N/A'}`);
        console.log(`   Price: KES ${part.price || '0'}`);
        console.log(`   Stock: ${part.stock_quantity || '0'}`);
        console.log(`   Category: ${part.category || 'N/A'}`);
        console.log(`   Vehicle: ${part.vehicle || 'N/A'}`);
        console.log('');
      });

      console.log('📝 Use one of these UUIDs in your API request:');
      console.log(`   "part_id": "${rows[0].id}"`);
    }

    // Check if there are any categories
    const { rows: categories } = await pool.query(`
      SELECT id, name FROM categories ORDER BY name LIMIT 5
    `);

    if (categories.length > 0) {
      console.log('\n📂 Available categories:');
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.id})`);
      });
    }

    // Check if there are any vehicles
    const { rows: vehicles } = await pool.query(`
      SELECT id, name, make, model FROM vehicles ORDER BY name LIMIT 5
    `);

    if (vehicles.length > 0) {
      console.log('\n🚗 Available vehicles:');
      vehicles.forEach(vehicle => {
        console.log(`   - ${vehicle.name} (${vehicle.id})`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking parts:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the check
checkParts().catch(console.error);
