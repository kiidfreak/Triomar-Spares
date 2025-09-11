const fetch = require('node-fetch');

async function testOrderAPI() {
  try {
    console.log('🔍 Testing order API endpoint...');
    
    const response = await fetch('http://localhost:3000/api/orders/ae9286be-6b66-47a1-a199-ac590edcb3ac');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response:');
      console.log('Success:', data.ok);
      console.log('Order ID:', data.data?.id);
      console.log('Customer Name:', data.data?.customer_name);
      console.log('Customer Email:', data.data?.customer_email);
      console.log('Customer Phone:', data.data?.customer_phone);
      console.log('Total Amount:', data.data?.total_amount);
      console.log('Final Amount:', data.data?.final_amount);
      console.log('Status:', data.data?.status);
      console.log('Payment Method:', data.data?.payment_method);
      console.log('Payment Status:', data.data?.payment_status);
      console.log('Created At:', data.data?.created_at);
      console.log('Updated At:', data.data?.updated_at);
      console.log('Items Count:', data.data?.items?.length);
      
      if (data.data?.items && data.data.items.length > 0) {
        console.log('\n📦 First Item:');
        const item = data.data.items[0];
        console.log('Part Name:', item.part_name);
        console.log('Part Number:', item.part_number);
        console.log('Brand:', item.brand);
        console.log('Category:', item.category_name);
        console.log('Quantity:', item.quantity);
        console.log('Unit Price:', item.unit_price);
        console.log('Total Price:', item.total_price);
      }
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.log('Error Response:', errorText);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testOrderAPI();
