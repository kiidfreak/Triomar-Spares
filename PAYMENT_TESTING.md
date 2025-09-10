# IntaSend Payment Testing Guide

## 🧪 Testing Overview

This guide covers testing all three payment methods integrated with IntaSend:
- **M-Pesa STK Push**
- **Credit/Debit Card Payments**
- **Google Pay**

## 📱 M-Pesa Testing

### Test Phone Numbers
Use these test phone numbers for M-Pesa payments:

```
254700000000 - 254799999999
```

### Test Scenarios

#### 1. Successful Payment
- **Phone**: `254700000000`
- **Amount**: KES 10-100 (small amounts for testing)
- **Expected**: Payment should complete successfully

#### 2. Insufficient Funds
- **Phone**: `254700000001`
- **Amount**: KES 1000+
- **Expected**: Payment should fail with "insufficient funds" error

#### 3. User Cancellation
- **Phone**: `254700000002`
- **Amount**: Any amount
- **Expected**: Payment should be cancelled by user

### Testing Steps

1. **Navigate to Checkout**
   - Add items to cart
   - Proceed to checkout
   - Select M-Pesa payment method

2. **Enter Test Phone Number**
   - Use format: `254700000000` or `0700000000`
   - Click "Pay with M-Pesa"

3. **Monitor Payment Status**
   - Check browser console for API responses
   - Verify order status updates in database
   - Check webhook events (if configured)

## 💳 Card Payment Testing

### Test Card Numbers

IntaSend provides test card numbers. Check their documentation for current test cards:

#### Visa Test Cards
```
Success: 4242424242424242
Declined: 4000000000000002
Insufficient Funds: 4000000000009995
```

#### Mastercard Test Cards
```
Success: 5555555555554444
Declined: 4000000000000069
```

### Test Scenarios

#### 1. Successful Payment
- **Card**: `4242424242424242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Expected**: Payment should complete successfully

#### 2. Declined Payment
- **Card**: `4000000000000002`
- **Expected**: Payment should be declined

#### 3. 3D Secure Authentication
- **Card**: `4000000000003220`
- **Expected**: Should redirect to 3D Secure authentication

### Testing Steps

1. **Navigate to Checkout**
   - Add items to cart
   - Proceed to checkout
   - Select "Credit/Debit Card" payment method

2. **Fill Customer Details**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`

3. **Complete Payment**
   - Click "Pay with Card"
   - You'll be redirected to IntaSend payment page
   - Use test card numbers on IntaSend's secure form

4. **Monitor Results**
   - Check redirect back to your application
   - Verify order status updates
   - Check webhook events

## 🅿️ Google Pay Testing

### Prerequisites
- Google Pay must be enabled in your IntaSend account
- Test with a Google account that has saved payment methods

### Test Scenarios

#### 1. Successful Google Pay Payment
- **Customer Details**: Fill in required fields
- **Expected**: Redirect to IntaSend with Google Pay option available

#### 2. Google Pay Not Available
- **Scenario**: Test with account that doesn't have Google Pay
- **Expected**: Should fall back to regular card payment

### Testing Steps

1. **Navigate to Checkout**
   - Add items to cart
   - Proceed to checkout
   - Select "Google Pay" payment method

2. **Fill Customer Details**
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@gmail.com` (use Gmail for Google Pay)

3. **Complete Payment**
   - Click "Pay with Google Pay"
   - You'll be redirected to IntaSend payment page
   - Google Pay button should be available if conditions are met

4. **Monitor Results**
   - Check payment completion
   - Verify order status updates
   - Check webhook events

## 🔍 API Testing

### Test API Endpoints Directly

#### M-Pesa Payment
```bash
curl -X POST http://localhost:3000/api/payments/intasend/mpesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{
    "order_id": "test_order_123",
    "phone_number": "254700000000"
  }'
```

#### Card Payment
```bash
curl -X POST http://localhost:3000/api/payments/intasend/card \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{
    "order_id": "test_order_123",
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com"
  }'
```

#### Google Pay Payment
```bash
curl -X POST http://localhost:3000/api/payments/intasend/googlepay \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_auth_token" \
  -d '{
    "order_id": "test_order_123",
    "first_name": "Test",
    "last_name": "User",
    "email": "test@gmail.com"
  }'
```

### Check Payment Status
```bash
curl -X GET "http://localhost:3000/api/payments/intasend/mpesa?order_id=test_order_123" \
  -H "Authorization: Bearer your_auth_token"
```

## 🗄️ Database Testing

### Check Payment Sessions
```sql
SELECT * FROM payment_sessions WHERE order_id = 'your_test_order_id';
```

### Check Payment Logs
```sql
SELECT * FROM payment_logs WHERE order_id = 'your_test_order_id' ORDER BY created_at DESC;
```

### Check Order Status
```sql
SELECT id, status, payment_method, payment_transaction_id, final_amount 
FROM orders WHERE id = 'your_test_order_id';
```

## 🐛 Debugging

### Common Issues and Solutions

#### 1. M-Pesa Payment Not Working
- **Check**: Phone number format (should be 254XXXXXXXXX or 0XXXXXXXXX)
- **Check**: Amount is in KES (not cents)
- **Check**: IntaSend account has M-Pesa enabled
- **Check**: Test phone numbers are valid

#### 2. Card Payment Redirect Issues
- **Check**: IntaSend public/secret keys are correct
- **Check**: Payment URL is being generated correctly
- **Check**: Customer details are being passed properly

#### 3. Google Pay Not Showing
- **Check**: Google Pay is enabled in IntaSend account
- **Check**: Customer email is a Gmail address
- **Check**: Browser supports Google Pay
- **Check**: Customer has Google Pay set up

#### 4. Webhook Not Receiving Events
- **Check**: Webhook URL is accessible from internet
- **Check**: Webhook secret is correct
- **Check**: SSL certificate is valid
- **Check**: IntaSend dashboard webhook configuration

### Debug Logs

Enable debug logging by checking your application console for:

```
IntaSend API Response: { ... }
Payment session created: { ... }
Webhook received: { ... }
Order status updated: { ... }
```

## 📊 Test Results Tracking

### Test Checklist

#### M-Pesa Tests
- [ ] Successful payment with test phone number
- [ ] Payment failure with insufficient funds
- [ ] User cancellation handling
- [ ] Phone number validation
- [ ] Amount formatting

#### Card Payment Tests
- [ ] Successful payment with test card
- [ ] Declined payment handling
- [ ] 3D Secure authentication
- [ ] Customer details validation
- [ ] Redirect flow

#### Google Pay Tests
- [ ] Google Pay option available
- [ ] Fallback to card payment
- [ ] Customer details validation
- [ ] Payment completion

#### Integration Tests
- [ ] Webhook events received
- [ ] Order status updates
- [ ] Database logging
- [ ] Error handling
- [ ] Payment status polling

### Performance Testing

- **Response Time**: API calls should complete within 5 seconds
- **Webhook Delivery**: Webhooks should be delivered within 30 seconds
- **Database Updates**: Order status should update within 10 seconds

## 🚀 Production Testing

Before going live:

1. **Use Production IntaSend Keys**
2. **Test with Real Phone Numbers** (small amounts)
3. **Verify Webhook URLs** are production URLs
4. **Test All Payment Methods** thoroughly
5. **Monitor Error Rates** and response times
6. **Set up Monitoring** for payment failures

## 📞 Support

If you encounter issues:

1. **Check IntaSend Documentation**: https://developers.intasend.com/docs
2. **Review Application Logs**: Check console and server logs
3. **Test API Endpoints**: Use curl commands above
4. **Contact IntaSend Support**: Through their dashboard
5. **Check Database**: Verify data integrity

## 🔒 Security Testing

- **Never use real payment details** in testing
- **Use test environment** for all testing
- **Verify webhook signatures** are working
- **Check for sensitive data** in logs
- **Test error handling** for security
