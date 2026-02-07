# Shopify Storefront API Access Token Setup Guide

## 🎯 Goal
Get a proper Storefront API access token to enable your application to fetch products, collections, and handle cart/checkout operations.

## 📋 Current Status
- ✅ Store Domain: `rouse-commerce-lab.myshopify.com`
- ✅ OAuth credentials configured (Admin API)
- ❌ Storefront API access token needed

---

## 🚀 Step-by-Step Instructions

### Step 1: Access Shopify Admin
1. Open your browser and go to:
   ```
   https://rouse-commerce-lab.myshopify.com/admin
   ```
2. Log in with your Shopify admin credentials

### Step 2: Navigate to App Settings
1. Click on **Settings** (bottom left of admin panel)
2. Click on **Apps and sales channels**
3. Click on **Develop apps** button (top right)
4. You should see your custom app listed

### Step 3: Select or Create Your App
**If you already have an app:**
- Click on your existing app name

**If you need to create a new app:**
1. Click **"Create an app"** button
2. Enter app name (e.g., "Storefront App" or "E-commerce Client")
3. Click **"Create app"**

### Step 4: Configure Storefront API Scopes
1. Click on the **"Configuration"** tab
2. Scroll down to the **"Storefront API"** section
3. Click **"Configure"** button
4. Select the following scopes (check the boxes):
   - ☑️ `unauthenticated_read_product_listings`
   - ☑️ `unauthenticated_read_product_inventory`
   - ☑️ `unauthenticated_read_product_tags`
   - ☑️ `unauthenticated_read_collection_listings`
   - ☑️ `unauthenticated_write_checkouts`
   - ☑️ `unauthenticated_read_checkouts`
   - ☑️ `unauthenticated_read_customer_tags`
   - ☑️ `unauthenticated_read_content` (for pages/blogs)
   
5. Click **"Save"** at the bottom

### Step 5: Install the App
1. After configuring scopes, you'll see an **"Install app"** button
2. Click **"Install app"**
3. Review the permissions
4. Click **"Install"** to confirm

### Step 6: Get Your Storefront Access Token
1. After installation, go to the **"API credentials"** tab
2. Scroll down to find the **"Storefront API access token"** section
3. You'll see a token that looks like:
   ```
   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
   (This is a hexadecimal string, NOT starting with `shpca_`)
4. Click the **"Copy"** button or manually copy the token

### Step 7: Update Your .env File
1. Open `/workspaces/shopify-ecom-project/shopify-storefront/.env`
2. Find this line:
   ```
   #SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```
3. Replace it with your new token (uncomment and update):
   ```
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=YOUR_TOKEN_HERE
   ```
   Example:
   ```
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=YOUR_ACTUAL_STOREFRONT_TOKEN
   ```

### Step 8: Test the Connection
Run the test script:
```bash
cd /workspaces/shopify-ecom-project/shopify-storefront
npx tsx scripts/testStorefrontAuth.ts
```

You should see:
```
✅ Successfully authenticated with Storefront API!
```

---

## 🔍 Troubleshooting

### Issue: "App not found" or "No apps listed"
**Solution:** You need to create a custom app first:
1. Settings → Apps and sales channels → Develop apps
2. Allow custom app development (if prompted)
3. Create a new app

### Issue: "Can't find Storefront API section"
**Solution:** Make sure you're in **Configuration** tab, not API credentials tab

### Issue: Token still showing as `shpca_...`
**Problem:** That's an Admin API token, not a Storefront token
**Solution:** 
- Go to API credentials tab
- Look specifically for "Storefront API access token" section
- It should be separate from "Admin API access token"

### Issue: "401 Unauthorized" even with new token
**Solution:**
1. Verify the app is installed (look for green "Installed" badge)
2. Check that Storefront API scopes are configured
3. Make sure you copied the entire token without spaces
4. Restart your dev server after updating .env

### Issue: Can't configure Storefront API scopes
**Solution:** You may need to enable "Storefront API" access:
1. In Configuration tab
2. Look for Storefront API section
3. If disabled, click "Enable" or "Configure"

---

## 📝 Important Notes

### Token Types Explained
- **Admin API token** (`shpca_...`) → Used for managing store data, creating products, etc.
- **Storefront API token** (hex string) → Used for customer-facing operations (browsing, cart, checkout)

### Which Token Do I Need?
- **Storefront (customer-facing):** Use `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- **Admin (backend operations):** Use OAuth credentials (`CLIENT_ID` + `CLIENT_SECRET`)

### Security Best Practices
- Storefront tokens are safe to use in public/client-side code
- Admin tokens should NEVER be exposed in client-side code
- Keep .env file in .gitignore
- Never commit tokens to version control

---

## ✅ Final Configuration

Your `.env` file should look like this:

```env
# Shopify Store Configuration
SHOPIFY_STORE_DOMAIN=rouse-commerce-lab.myshopify.com
PUBLIC_STORE_URL=https://rouse-commerce-lab.myshopify.com

# Storefront API (for customer-facing operations)
SHOPIFY_STOREFRONT_ACCESS_TOKEN=YOUR_ACTUAL_TOKEN_HERE

# Admin API (for backend operations)
SHOPIFY_CLIENT_ID=your_client_id_here
SHOPIFY_CLIENT_SECRET=your_client_secret_here
```

---

## 🎉 Success!

Once you have the correct Storefront API token, you'll be able to:
- ✅ Fetch products and collections
- ✅ Display product details and images
- ✅ Create and manage shopping carts
- ✅ Process checkouts
- ✅ Search products
- ✅ Get shop information

Need more help? Check the [Shopify Storefront API documentation](https://shopify.dev/docs/api/storefront)
