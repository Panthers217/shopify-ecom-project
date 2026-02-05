# Shopify Custom App Setup Guide

This guide will help you configure your Shopify custom app credentials for the storefront.

## 📋 Overview

Your Shopify storefront can authenticate using **two methods**:

### Option 1: Direct Storefront Access Token (Simpler)
- Get a Storefront API access token directly from Shopify admin
- Best for public-facing storefronts
- No OAuth flow needed

### Option 2: Client Credentials OAuth Flow (What You Have)
- Use Client ID and Client Secret
- App automatically exchanges credentials for access token
- Required when Shopify provides custom app credentials
- Supports both Admin API and Storefront API

## 🔑 Getting Your Client Credentials

### Step 1: Access Your Custom App

1. Log in to your **Shopify Admin** panel
2. Go to **Settings** → **Apps and sales channels**
3. Click **Develop apps**
4. Select your custom app (or create one if you haven't)

### Step 2: Configure API Access

1. Click **Configure** on "Admin API integration"
2. Select the **Storefront API** scopes you need:
   - ✅ `unauthenticated_read_product_listings` (includes collections)
   - ✅ `unauthenticated_read_product_inventory`
   - ✅ `unauthenticated_read_product_tags`
   - ✅ `unauthenticated_read_content`
   - ✅ `unauthenticated_write_checkouts` (for cart/checkout)
   - ✅ `unauthenticated_read_checkouts`
   - ✅ `unauthenticated_read_customer_tags` (optional, for customer features)

3. Click **Save**

**Note:** Collections are accessible through the `unauthenticated_read_product_listings` scope.

### Step 3: Get Your Credentials

1. Go to **API credentials** tab
2. You'll see:
   - **Client ID** (looks like: `shpca_xxxxxxxxxx`)
   - **Client secret** (long alphanumeric string)
   - **Storefront API access token** (if you want Option 1)

### Step 4: Configure Your .env File

Open `/workspaces/shopify-ecom-project/shopify-storefront/.env` and update:

```env
# Your store domain (already set)
SHOPIFY_STORE_DOMAIN=rouse-commerce-lab.myshopify.com
PUBLIC_STORE_URL=https://rouse-commerce-lab.myshopify.com

# Option 2: Client Credentials (REPLACE THESE)
SHOPIFY_CLIENT_ID=shpca_your_actual_client_id_here
SHOPIFY_CLIENT_SECRET=shpss_your_actual_client_secret_here
```

**Important:** Replace `your_client_id_here` and `your_client_secret_here` with your actual credentials from Shopify.

## 🚀 Testing Your Setup

### 1. Start the development server:

```bash
cd /workspaces/shopify-ecom-project/shopify-storefront
npm run dev
```

### 2. Check the console output

You should see the server start without credential warnings.

### 3. Visit your storefront

Open `http://localhost:3000` in your browser.

### 4. Test API connection

Try navigating to different pages:
- Home page → Should load (even without products)
- Products page → Will attempt to fetch from Shopify
- Collections page → Will attempt to fetch from Shopify

## 🔧 How It Works

When you use **Client Credentials OAuth Flow**:

1. Your app sends Client ID + Client Secret to Shopify
2. Shopify validates and returns an **Access Token**
3. Access token is cached for 23 hours
4. App uses this token for all Storefront API requests
5. Token automatically refreshes when expired

The implementation is in `app/lib/shopifyStorefront.server.ts`:

```typescript
// OAuth Token Request
POST https://rouse-commerce-lab.myshopify.com/admin/oauth/access_token
Body: {
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "grant_type": "client_credentials"
}

// Response
{
  "access_token": "shpat_xxxxx...",
  "scope": "...",
  "expires_in": 86400
}
```

## ⚠️ Security Notes

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Keep your Client Secret private** - Don't share or expose it
3. **Use environment variables** in production deployment
4. **Rotate credentials** periodically for security

## 🐛 Troubleshooting

### "Client credentials not configured" error

**Solution:** Make sure you've set both `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` in your `.env` file.

### "OAuth token request failed" error

**Possible causes:**
1. Client ID or Secret is incorrect
2. App hasn't been installed on your store
3. Store domain is wrong
4. API scopes not configured

**Solution:** Double-check credentials in Shopify Admin → Apps → Your App → API credentials

### "Access denied" or "403 Forbidden"

**Cause:** Missing API scopes

**Solution:** 
1. Go to Shopify Admin → Apps → Your App → Configuration
2. Add required Storefront API scopes (see Step 2 above)
3. Click Save

### Storefront returns empty products

**Possible causes:**
1. No products published to your storefront
2. Products not published to "Online Store" sales channel

**Solution:**
1. Go to Shopify Admin → Products
2. Select a product → Manage → Sales channels
3. Make sure "Online Store" is checked
4. Publish the product

## 📚 Additional Resources

- [Shopify Storefront API Documentation](https://shopify.dev/api/storefront)
- [Custom App Setup Guide](https://shopify.dev/apps/build/authentication-authorization)
- [Client Credentials Flow](https://shopify.dev/apps/build/authentication-authorization/access-tokens/client-credentials)

## ✅ Quick Checklist

- [ ] Custom app created in Shopify Admin
- [ ] Storefront API scopes configured
- [ ] Client ID copied to `.env`
- [ ] Client Secret copied to `.env`
- [ ] Store domain set correctly
- [ ] Dependencies installed (`npm install`)
- [ ] Dev server running (`npm run dev`)
- [ ] Products published to Online Store channel

---

Need help? The app logs will show which authentication method is being used during startup.
