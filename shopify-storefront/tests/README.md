# Authentication Tests

This directory contains tests for verifying customer authentication functionality.

## Setup

Before running tests, make sure you have:

1. **Add SESSION_SECRET to your `.env` file**
   ```bash
   # Generate a secure session secret
   openssl rand -hex 32
   ```
   
   Then add to `.env`:
   ```
   SESSION_SECRET=your_generated_secret_here
   ```

2. **Create a test customer in your Shopify store**
   - Go to your Shopify Admin
   - Navigate to: Customers > Add customer
   - Create a test customer with email and password
   - Note the email and password for testing

## Running Tests

### Customer Authentication Test

Tests login validation, password verification, and session management:

```bash
cd shopify-storefront
npx tsx tests/testCustomerAuth.ts
```

**Before running**, update these variables in `testCustomerAuth.ts`:
```typescript
const TEST_EMAIL = "test@example.com";      // Your test customer email
const TEST_PASSWORD = "testpassword123";     // Your test customer password
```

### What Gets Tested

✅ **Session Secret Configuration** - Validates SESSION_SECRET is set and secure  
✅ **Valid Login** - Tests successful authentication with correct credentials  
✅ **Invalid Password** - Ensures wrong passwords are rejected  
✅ **Non-existent Email** - Ensures fake emails are rejected

### Expected Output

```
🧪 Customer Authentication Test

==================================================

📝 Test 1: Login with Valid Credentials
--------------------------------------------------
✅ PASSED: Successfully logged in
Token: abcdef1234567890...
Expires: 2024-04-15T12:00:00Z

📝 Test 2: Login with Invalid Password
--------------------------------------------------
✅ PASSED: Invalid password was rejected
Error message: Unidentified customer

📝 Test 3: Login with Non-existent Email
--------------------------------------------------
✅ PASSED: Non-existent email was rejected

📝 Test 4: Validate Session Secret
--------------------------------------------------
✅ PASSED: SESSION_SECRET is properly configured

==================================================
📊 TEST SUMMARY
==================================================

Total: 4/4 tests passed

🎉 All tests passed! Authentication is working correctly.
```

## Manual Testing

You can also test the login/signup forms manually:

### Test Login Page
1. Start the dev server: `npm run dev`
2. Navigate to: `http://localhost:5173/account/login`
3. Try logging in with:
   - ✅ Valid credentials (should redirect to `/account`)
   - ❌ Invalid password (should show error)
   - ❌ Non-existent email (should show error)

### Test Signup Page
1. Navigate to: `http://localhost:5173/account/signup`
2. Create a new account
3. Should automatically log in and redirect to `/account`

## Troubleshooting

### "SESSION_SECRET is not set"
Add `SESSION_SECRET` to your `.env` file (see Setup above)

### "Login returned errors"
- Check that your test customer exists in Shopify
- Verify the email and password are correct
- Make sure customer accounts are enabled in your Shopify store

### "SHOPIFY_STOREFRONT_ACCESS_TOKEN not configured"
Make sure your `.env` file has valid Shopify credentials

## Security Notes

⚠️ **Never commit**:
- Your `.env` file with real credentials
- Test credentials in the test files
- Customer access tokens in version control

Keep test credentials separate from production!
