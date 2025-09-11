const { Pool } = require('pg');

async function addNissanZD30Engine() {
  console.log('🚀 Adding Nissan ZD30 engine to database...');

  const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway';
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Railway's self-signed certs
    },
  });

  const client = await pool.connect();

  try {
    // First, ensure we have the Engine & Filters category
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Engine & Filters') THEN
          INSERT INTO categories (id, name, description)
          VALUES (
            uuid_generate_v4(),
            'Engine & Filters',
            'Engine components and filters'
          );
        END IF;
      END $$;
    `);

    // Add Nissan ZD30 engine
    const result = await client.query(`
      INSERT INTO parts (
        id,
        name,
        description,
        category_id,
        price,
        brand,
        stock_quantity,
        min_stock_level,
        is_active,
        warranty_months,
        part_number
      )
      VALUES (
        uuid_generate_v4(),
        'Nissan ZD30 Engine - Hardbody',
        'Nissan ZD30 diesel engine for Hardbody/Caravan. Complete engine assembly with all accessories. Perfect for engine swaps and rebuilds. Low mileage, excellent condition.',
        (SELECT id FROM categories WHERE name = 'Engine & Filters' LIMIT 1),
        450000,
        'Nissan',
        3,
        1,
        true,
        6,
        'ZD30-HARDBODY'
      )
      RETURNING id;
    `);

    const partId = result.rows[0].id;

    // Add product image
    await client.query(`
      INSERT INTO product_images (id, part_id, image_url, image_alt, is_primary, sort_order)
      VALUES (
        uuid_generate_v4(),
        $1,
        '/images/categories/ZD30Nissanhardbodyengine.webp',
        'Nissan ZD30 Engine - Hardbody',
        true,
        1
      );
    `, [partId]);

    console.log('✅ Successfully added Nissan ZD30 engine to database!');
    console.log('📦 Added product:');
    console.log('   - Nissan ZD30 Engine - Hardbody (KSH 450,000)');
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Error adding Nissan ZD30 engine:', error);
    console.error('💥 Migration failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

addNissanZD30Engine();
