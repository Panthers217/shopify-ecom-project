# Shopify Data Setup Scripts

This folder contains scripts to populate your Shopify store with collections and products.

## Prerequisites

Make sure you have your `.env` file configured with:
```env
SHOPIFY_STORE_DOMAIN=rouse-commerce-lab.myshopify.com
SHOPIFY_CLIENT_ID=your_client_id
SHOPIFY_CLIENT_SECRET=your_client_secret
```

## Step 1: Create Collections

Run this script to automatically create all 9 collections:

```bash
cd /workspaces/shopify-ecom-project/shopify-storefront
npx tsx scripts/createCollections.ts
```

This will create:
- Apparel
- Accessories
- Jewelry
- Shoes
- Sale
- Women
- Men
- Kids
- Bestseller

## Step 2: Import Products

### Option A: Using Shopify Admin (Recommended)

1. Go to your Shopify Admin: https://rouse-commerce-lab.myshopify.com/admin
2. Navigate to **Products** → **Import**
3. Upload the `mockProducts.csv` file
4. Shopify will automatically:
   - Create the products
   - Create variants (sizes, colors)
   - Assign products to collections
   - Set prices and compare-at prices

### Option B: Manual Review

Open `scripts/mockProducts.csv` to see the product data structure. You can:
- Edit product details
- Change prices
- Modify descriptions
- Add/remove variants
- Update collection assignments (last column)

## Products Included

The CSV includes 8 products with multiple variants:

1. **Classic Cotton T-Shirt** - 5 variants (S/M/L in White/Black)
   - Collections: apparel, bestseller, women, men, sale
   - Price: $29.99 (Compare at: $39.99)

2. **Leather Crossbody Bag** - 2 variants (Brown/Black)
   - Collections: accessories, women, bestseller
   - Price: $129.99

3. **Gold Hoop Earrings** - 3 variants (Small/Medium/Large)
   - Collections: jewelry, women, sale
   - Price: $49.99 (Compare at: $79.99)

4. **Running Shoes** - 4 variants (Sizes 7-10 in Blue)
   - Collections: shoes, men, women
   - Price: $89.99

5. **Denim Jacket** - 4 variants (S/M/L/XL)
   - Collections: apparel, men, women, sale
   - Price: $69.99-74.99 (Compare at: $99.99)

6. **Aviator Sunglasses** - 1 variant
   - Collections: accessories, men, women, sale
   - Price: $39.99 (Compare at: $59.99)

7. **Kids Graphic Tee** - 3 variants (4T/5T/6T)
   - Collections: kids, apparel
   - Price: $19.99

8. **Bestseller Bundle** - 1 variant
   - Collections: bestseller, sale
   - Price: $149.99 (Compare at: $199.99)

## After Import

1. Refresh your storefront at http://localhost:5174
2. Click on navbar items (Apparel, Shoes, etc.)
3. You should see products displayed with:
   - Sale badges (items with compare-at prices)
   - Product images (will use Shopify placeholders)
   - Proper pricing
   - Multiple variants

## Troubleshooting

**Collections not showing products:**
- Make sure the collection handles in Shopify match exactly: `apparel`, `accessories`, etc.
- Check that products were assigned to collections (last column in CSV)

**Import errors:**
- Make sure CSV is properly formatted
- Check that all required columns are present
- Verify collections exist before importing products

**API errors when running createCollections.ts:**
- Verify your Client ID and Secret in `.env`
- Make sure your custom app has Admin API write permissions
- Check that the app is installed on your store
