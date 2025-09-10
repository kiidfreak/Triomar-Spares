# IntaSend Integration Setup Guide

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# IntaSend Configuration
INTASEND_PUBLIC_KEY=ISPubKey_live_84fc6369-0294-45cf-b1f0-9763814a8272
INTASEND_SECRET_KEY=ISSecretKey_live_60e52d4e-38b1-4d2d-8587-c71bbf8eb40e
INTASEND_WEBHOOK_SECRET=your_webhook_secret_here

# Business Information
BUSINESS_NAME=Triomar AutoSpares
BUSINESS_PHONE=+254700000000
BUSINESS_EMAIL=info@triomarautospares.com

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Database Schema Updates

The integration requires the following database tables. Make sure they exist in your Supabase database:

### Payment Sessions Table
```sql
CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL UNIQUE,
  provider VARCHAR(50) NOT NULL,
  session_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Payment Logs Table
```sql
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL,
  provider VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255),
  response_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Orders Table Updates
Make sure your orders table has these columns:
```sql
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_transaction_id VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(50) DEFAULT 'standard';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
```

**Quick Migration:**
Run the database migration script to add all missing columns:
```bash
node scripts/apply-database-migration.js
```

## Webhook Configuration

1. **Set up webhook in IntaSend Dashboard:**
   - Go to your IntaSend dashboard
   - Navigate to Webhooks section
   - Add webhook URL: `https://yourdomain.com/api/payments/intasend/webhook`
   - Select events: Payment Collection Events
   - Save the webhook secret and add it to your environment variables

2. **Test webhook locally:**
   - Use ngrok or similar tool to expose your local server
   - Update webhook URL in IntaSend dashboard to your ngrok URL

## Testing

### M-Pesa Testing
- Use test phone numbers: `254700000000` to `254799999999`
- Test amounts: Use small amounts like KES 10-100
- Check IntaSend sandbox environment first

### Card Testing
- Use test card numbers provided by IntaSend
- Test with different scenarios (success, failure, 3D Secure)

## API Endpoints

The integration provides these API endpoints:

- `POST /api/payments/intasend/mpesa` - Initiate M-Pesa payment
- `GET /api/payments/intasend/mpesa?order_id=xxx` - Check M-Pesa payment status
- `POST /api/payments/intasend/card` - Create card payment session
- `GET /api/payments/intasend/card?order_id=xxx` - Check card payment status
- `POST /api/payments/intasend/googlepay` - Create Google Pay payment session
- `GET /api/payments/intasend/googlepay?order_id=xxx` - Check Google Pay payment status
- `POST /api/payments/intasend/webhook` - Webhook handler for payment updates

## Frontend Components

- `IntaSendPayment` component handles M-Pesa, card, and Google Pay payments
- Integrated into the checkout page
- Provides real-time payment status updates
- Includes proper error handling and user feedback
- Google Pay integration uses IntaSend's Checkout API with Google Pay enabled

## Security Notes

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Verify webhook signatures in production**
4. **Use HTTPS for all webhook endpoints**
5. **Implement proper error handling and logging**

## Production Deployment

1. **Update environment variables for production**
2. **Set up proper webhook URLs**
3. **Configure IntaSend for live environment**
4. **Test thoroughly before going live**
5. **Monitor payment logs and webhook deliveries**

## Additional Documentation

- **WEBHOOK_SETUP.md** - Detailed webhook configuration guide
- **PAYMENT_TESTING.md** - Comprehensive testing guide for all payment methods
- **scripts/generate-env-secrets.js** - Generate secure environment variables
- **scripts/setup-intasend.js** - Setup verification script

## Quick Setup Commands

```bash
# Generate secure environment variables
node scripts/generate-env-secrets.js

# Verify setup
node scripts/setup-intasend.js

# Start development server
npm run dev
```

## Support

For IntaSend-specific issues:
- Check IntaSend documentation: https://developers.intasend.com/
- Contact IntaSend support through their dashboard
- Review webhook logs in IntaSend dashboard

For integration issues:
- Check application logs
- Verify database schema
- Test API endpoints individually
- Review WEBHOOK_SETUP.md and PAYMENT_TESTING.md guides
