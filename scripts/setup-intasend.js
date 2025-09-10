#!/usr/bin/env node

/**
 * IntaSend Integration Setup Script
 * Run with: node scripts/setup-intasend.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 IntaSend Integration Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env.local file already exists');
  console.log('📝 Please update it with the IntaSend configuration from INTASEND_SETUP.md\n');
} else {
  console.log('❌ .env.local file not found');
  console.log('📝 Please create .env.local file with the configuration from INTASEND_SETUP.md\n');
}

// Check if required directories exist
const requiredDirs = [
  'src/app/api/payments/intasend',
  'src/components/payments',
  'src/lib'
];

console.log('📁 Checking required directories:');
requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - Missing`);
  }
});

// Check if required files exist
const requiredFiles = [
  'src/lib/intasend.ts',
  'src/app/api/payments/intasend/mpesa/route.ts',
  'src/app/api/payments/intasend/card/route.ts',
  'src/app/api/payments/intasend/googlepay/route.ts',
  'src/app/api/payments/intasend/webhook/route.ts',
  'src/components/payments/intasend-payment.tsx'
];

console.log('\n📄 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
  }
});

// Check if database tables exist (this would require database connection)
console.log('\n🗄️ Database Setup:');
console.log('📝 Please ensure these tables exist in your Supabase database:');
console.log('   - payment_sessions');
console.log('   - payment_logs');
console.log('   - orders (with payment_method and payment_transaction_id columns)');
console.log('   See INTASEND_SETUP.md for SQL commands');

console.log('\n🔗 Next Steps:');
console.log('1. 📝 Create/update .env.local with IntaSend configuration');
console.log('2. 🗄️ Set up database tables (see INTASEND_SETUP.md)');
console.log('3. 🔗 Configure webhook in IntaSend dashboard (see WEBHOOK_SETUP.md)');
console.log('4. 🧪 Test payments (see PAYMENT_TESTING.md)');
console.log('5. 🚀 Deploy to production');

console.log('\n📚 Documentation:');
console.log('- INTASEND_SETUP.md - Complete setup guide');
console.log('- WEBHOOK_SETUP.md - Webhook configuration');
console.log('- PAYMENT_TESTING.md - Testing guide');

console.log('\n🎉 IntaSend integration is ready to use!');
