# IntaSend Webhook Setup Guide

## 🔗 Webhook Configuration Steps

### 1. IntaSend Dashboard Setup

1. **Login to IntaSend Dashboard**
   - Go to [IntaSend Dashboard](https://dashboard.intasend.com)
   - Login with your account credentials

2. **Navigate to Webhooks Section**
   - In the dashboard, find and click on "Webhooks" or "API Settings"
   - Look for "Webhook Configuration" or similar section

3. **Add New Webhook**
   - Click "Add Webhook" or "Create Webhook"
   - Fill in the following details:

   **Webhook URL:**
   ```
   Production: https://yourdomain.com/api/payments/intasend/webhook
   Development: https://your-ngrok-url.ngrok.io/api/payments/intasend/webhook
   ```

   **Events to Subscribe:**
   - ✅ Payment Collection Events
   - ✅ Payment Status Updates
   - ✅ Payment Failures

4. **Save and Get Webhook Secret**
   - Save the webhook configuration
   - Copy the webhook secret (it will look like: `whsec_xxxxxxxxxxxxx`)
   - Add this secret to your `.env.local` file

### 2. Local Development Setup

For local testing, you'll need to expose your local server to the internet:

#### Option A: Using ngrok (Recommended)

1. **Install ngrok**
   ```bash
   npm install -g ngrok
   # or download from https://ngrok.com/download
   ```

2. **Start your Next.js app**
   ```bash
   npm run dev
   ```

3. **Expose local server**
   ```bash
   ngrok http 3000
   ```

4. **Update webhook URL in IntaSend**
   - Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
   - Update webhook URL in IntaSend dashboard to: `https://abc123.ngrok.io/api/payments/intasend/webhook`

#### Option B: Using other tunneling services
- **Cloudflare Tunnel**: `cloudflared tunnel --url http://localhost:3000`
- **LocalTunnel**: `npx localtunnel --port 3000`

### 3. Environment Variables Update

Update your `.env.local` file with the webhook secret:

```bash
# IntaSend Configuration
INTASEND_PUBLIC_KEY=ISPubKey_live_84fc6369-0294-45cf-b1f0-9763814a8272
INTASEND_SECRET_KEY=ISSecretKey_live_60e52d4e-38b1-4d2d-8587-c71bbf8eb40e
INTASEND_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here

# Business Information
BUSINESS_NAME=Triomar AutoSpares
BUSINESS_PHONE=+254700000000
BUSINESS_EMAIL=info@triomarautospares.com

# Application URLs
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string_here
```

### 4. Webhook Testing

#### Test Webhook Endpoint
You can test your webhook endpoint manually:

```bash
curl -X POST http://localhost:3000/api/payments/intasend/webhook \
  -H "Content-Type: application/json" \
  -H "x-intasend-signature: your_webhook_secret" \
  -d '{
    "invoice_id": "test_invoice_123",
    "api_ref": "test_order_123",
    "status": "COMPLETE",
    "amount": 100,
    "currency": "KES",
    "phone_number": "254700000000",
    "narrative": "Test payment",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }'
```

#### Monitor Webhook Logs
Check your application logs for webhook events:

```bash
# In your terminal where you're running npm run dev
# Look for logs like:
# "IntaSend Webhook received: { ... }"
# "Webhook processed successfully"
```

### 5. Production Deployment

When deploying to production:

1. **Update Webhook URL**
   - Change webhook URL in IntaSend dashboard to your production domain
   - Example: `https://triomarautospares.com/api/payments/intasend/webhook`

2. **Update Environment Variables**
   - Set `NEXTAUTH_URL` to your production URL
   - Ensure all API keys are production keys (not test keys)

3. **SSL Certificate**
   - Ensure your production domain has a valid SSL certificate
   - IntaSend requires HTTPS for webhook endpoints

### 6. Webhook Events Handling

Your webhook handler processes these events:

- **Payment Complete**: Updates order status to 'confirmed'
- **Payment Failed**: Updates order status to 'payment_failed'
- **Payment Pending**: Updates order status to 'payment_pending'

### 7. Troubleshooting

#### Common Issues:

1. **Webhook not receiving events**
   - Check if webhook URL is accessible from internet
   - Verify SSL certificate is valid
   - Check IntaSend dashboard for webhook delivery logs

2. **Invalid signature errors**
   - Verify `INTASEND_WEBHOOK_SECRET` matches the secret from IntaSend dashboard
   - Check if webhook secret is correctly set in environment variables

3. **Database errors**
   - Ensure database tables exist (payment_sessions, payment_logs)
   - Check database connection string
   - Verify order exists in database

#### Debug Commands:

```bash
# Check if webhook endpoint is accessible
curl -I https://yourdomain.com/api/payments/intasend/webhook

# Test webhook with sample data
curl -X POST https://yourdomain.com/api/payments/intasend/webhook \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### 8. Security Best Practices

1. **Always verify webhook signatures** (implemented in your code)
2. **Use HTTPS for all webhook endpoints**
3. **Log all webhook events for debugging**
4. **Implement rate limiting for webhook endpoints**
5. **Never expose webhook secrets in client-side code**

## ✅ Verification Checklist

- [ ] Webhook URL configured in IntaSend dashboard
- [ ] Webhook secret added to environment variables
- [ ] Webhook endpoint accessible from internet (for testing)
- [ ] SSL certificate valid (for production)
- [ ] Database tables created (payment_sessions, payment_logs)
- [ ] Test webhook events received and processed
- [ ] Payment status updates working correctly
- [ ] Error handling and logging implemented

## 📞 Support

If you encounter issues:

1. **Check IntaSend Documentation**: https://developers.intasend.com/docs
2. **Review Webhook Logs**: Check IntaSend dashboard for delivery status
3. **Application Logs**: Check your application logs for errors
4. **Contact IntaSend Support**: Through their dashboard support system
