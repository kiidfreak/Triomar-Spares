#!/usr/bin/env node

/**
 * Generate secure environment variables for IntaSend integration
 * Run with: node scripts/generate-env-secrets.js
 */

const crypto = require('crypto');

function generateSecureSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function generateNextAuthSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('🔐 IntaSend Environment Variables Generator\n');

console.log('Add these to your .env.local file:\n');

console.log('# IntaSend Configuration');
console.log('INTASEND_PUBLIC_KEY=ISPubKey_live_84fc6369-0294-45cf-b1f0-9763814a8272');
console.log('INTASEND_SECRET_KEY=ISSecretKey_live_60e52d4e-38b1-4d2d-8587-c71bbf8eb40e');
console.log(`INTASEND_WEBHOOK_SECRET=${generateSecureSecret(24)}`);

console.log('\n# Business Information');
console.log('BUSINESS_NAME=Triomar AutoSpares');
console.log('BUSINESS_PHONE=+254700000000');
console.log('BUSINESS_EMAIL=info@triomarautospares.com');

console.log('\n# Application URLs');
console.log('NEXTAUTH_URL=http://localhost:3000');
console.log(`NEXTAUTH_SECRET=${generateNextAuthSecret()}`);

console.log('\n# Supabase Configuration');
console.log('NEXT_PUBLIC_SUPABASE_URL=https://rjgooqmfjkfsyjqhdwp.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqZ29vcW1mamtmc3lqeXFoZHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2MjQ0NzksImV4cCI6MjA2NzIwMDQ3OX0.OejmlFf9fwE-Tpl4DEzNW2NsMZnSfWnzJEkrPhupL1Y');
console.log('DATABASE_URL=postgresql://postgres:sfsGvIDcknpkHUUMQZqQUsDTNLgrbLuH@crossover.proxy.rlwy.net:21161/railway');

console.log('\n# Optional: force SSL in non-prod');
console.log('PGSSL=true');

console.log('\n📝 Instructions:');
console.log('1. Copy the above content to your .env.local file');
console.log('2. Update INTASEND_WEBHOOK_SECRET with the actual secret from IntaSend dashboard');
console.log('3. Update NEXTAUTH_URL to your production URL when deploying');
console.log('4. Never commit .env.local to version control');

console.log('\n🔗 Next Steps:');
console.log('1. Set up webhook in IntaSend dashboard (see WEBHOOK_SETUP.md)');
console.log('2. Test payments using PAYMENT_TESTING.md guide');
console.log('3. Deploy to production with updated URLs');
