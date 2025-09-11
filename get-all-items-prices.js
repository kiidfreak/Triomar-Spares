const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway'
});

async function getAllItemsWithPrices() {
  try {
    console.log('Fetching all items with prices from database...\n');
    
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.stock_quantity,
        p.brand,
        p.part_number,
        p.warranty_months,
        p.is_active,
        p.created_at,
        p.updated_at,
        c.name as category_name
      FROM parts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    
    console.log(`Found ${result.rows.length} items in database:\n`);
    console.log('='.repeat(120));
    console.log('ID'.padEnd(38) + 'Name'.padEnd(30) + 'Price'.padEnd(15) + 'Stock'.padEnd(8) + 'Brand'.padEnd(12) + 'Category');
    console.log('='.repeat(120));
    
    result.rows.forEach((item, index) => {
      const id = item.id.substring(0, 8) + '...';
      const name = item.name.length > 28 ? item.name.substring(0, 25) + '...' : item.name;
      const price = item.price ? `KSH ${parseFloat(item.price).toLocaleString()}` : 'N/A';
      const stock = item.stock_quantity || 0;
      const brand = item.brand || 'N/A';
      const category = item.category_name || 'N/A';
      
      console.log(
        id.padEnd(38) + 
        name.padEnd(30) + 
        price.padEnd(15) + 
        stock.toString().padEnd(8) + 
        brand.padEnd(12) + 
        category
      );
    });
    
    console.log('='.repeat(120));
    
    // Summary statistics
    const totalItems = result.rows.length;
    const itemsWithPrices = result.rows.filter(item => item.price && item.price > 0).length;
    const totalValue = result.rows.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const avgPrice = totalValue / itemsWithPrices || 0;
    
    console.log('\n📊 SUMMARY STATISTICS:');
    console.log(`Total Items: ${totalItems}`);
    console.log(`Items with Prices: ${itemsWithPrices}`);
    console.log(`Total Inventory Value: KSH ${totalValue.toLocaleString()}`);
    console.log(`Average Price: KSH ${avgPrice.toLocaleString()}`);
    
    // Price range analysis
    const prices = result.rows.map(item => parseFloat(item.price) || 0).filter(price => price > 0);
    if (prices.length > 0) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      console.log(`Price Range: KSH ${minPrice.toLocaleString()} - KSH ${maxPrice.toLocaleString()}`);
    }
    
    // Category breakdown
    const categories = {};
    result.rows.forEach(item => {
      const category = item.category_name || 'Uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    console.log('\n📂 CATEGORY BREAKDOWN:');
    Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category}: ${count} items`);
      });
    
    // Brand breakdown
    const brands = {};
    result.rows.forEach(item => {
      const brand = item.brand || 'Unknown';
      brands[brand] = (brands[brand] || 0) + 1;
    });
    
    console.log('\n🏷️ BRAND BREAKDOWN:');
    Object.entries(brands)
      .sort(([,a], [,b]) => b - a)
      .forEach(([brand, count]) => {
        console.log(`${brand}: ${count} items`);
      });
    
  } catch (error) {
    console.error('Error fetching items:', error.message);
  } finally {
    await pool.end();
  }
}

getAllItemsWithPrices();
