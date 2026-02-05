# Shopify Storefront API Implementation

This document explains the implementation of the three core library files that power the Shopify integration.

## 📁 File Overview

1. **[app/lib/shopifyStorefront.server.ts](app/lib/shopifyStorefront.server.ts)** - API Client
2. **[app/lib/queries.ts](app/lib/queries.ts)** - GraphQL Queries & Mutations  
3. **[app/lib/productMapper.ts](app/lib/productMapper.ts)** - Data Transformation

---

## 1. Storefront API Client
**File:** `app/lib/shopifyStorefront.server.ts`

### Overview
Handles all communication with Shopify's Storefront GraphQL API. Supports both direct access tokens and OAuth client credentials flow.

### Main Function: `storefrontFetch<T>`

```typescript
storefrontFetch<T>(query: string, variables?: Record<string, any>): Promise<T>
```

**Parameters:**
- `query` - GraphQL query or mutation string
- `variables` - Optional variables for the query

**Returns:** Typed response data from Shopify API

**Environment Variables:**
- `SHOPIFY_STORE_DOMAIN` - Your store domain (e.g., `your-store.myshopify.com`)
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN` - Direct token (Option 1)
- `SHOPIFY_CLIENT_ID` - Custom app client ID (Option 2)
- `SHOPIFY_CLIENT_SECRET` - Custom app client secret (Option 2)

### Authentication Flow

#### Option 1: Direct Access Token
```
User Request → storefrontFetch() → [Use Direct Token] → Shopify API
```

#### Option 2: OAuth Client Credentials
```
User Request → storefrontFetch() 
             → getAccessToken() 
             → Check Cache 
             → [If Expired] getAccessTokenViaOAuth()
             → POST /admin/oauth/access_token
             → Cache Token (23 hours)
             → Shopify API
```

### Key Features

✅ **Token Caching:** OAuth tokens cached for 23 hours  
✅ **Auto-Refresh:** Automatically refreshes expired tokens  
✅ **Error Handling:** Detailed error messages with API responses  
✅ **Type Safety:** Full TypeScript support with generics  
✅ **Dual Auth:** Supports both authentication methods

### Usage Example

```typescript
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "~/lib/queries";

const response = await storefrontFetch<{ product: ShopifyProduct }>(
  GET_PRODUCT_BY_HANDLE_QUERY,
  { handle: "cool-t-shirt" }
);

const product = response.product;
```

---

## 2. GraphQL Queries
**File:** `app/lib/queries.ts`

### Overview
Contains all GraphQL queries and mutations for fetching products, collections, and managing cart operations.

### Query Categories

#### 📦 Product Queries

1. **`GET_PRODUCTS_QUERY`** - List all products with pagination
   - Supports search, sorting, filtering
   - Variables: `first`, `after`, `query`, `sortKey`, `reverse`

2. **`GET_PRODUCT_BY_HANDLE_QUERY`** - Single product by handle
   - Used for product detail pages
   - Variables: `handle`

3. **`SEARCH_PRODUCTS_QUERY`** - Search products
   - Full-text search across products
   - Variables: `query`, `first`

#### 📚 Collection Queries

4. **`GET_COLLECTION_BY_HANDLE_QUERY`** - Collection with products
   - Used for category pages
   - Variables: `handle`, `first`, `after`, `sortKey`, `reverse`

5. **`GET_COLLECTIONS_QUERY`** - List all collections
   - Used for navigation
   - Variables: `first`, `after`

#### 🛒 Cart Mutations

6. **`CREATE_CART_MUTATION`** - Create new cart
   - Variables: `input` (lines array)

7. **`ADD_TO_CART_MUTATION`** - Add items to cart
   - Variables: `cartId`, `lines`

8. **`UPDATE_CART_LINE_MUTATION`** - Update quantities
   - Variables: `cartId`, `lines`

9. **`REMOVE_FROM_CART_MUTATION`** - Remove items
   - Variables: `cartId`, `lineIds`

10. **`GET_CART_QUERY`** - Retrieve cart by ID
    - Variables: `cartId`

### Product Fragment

The `PRODUCT_FRAGMENT` includes all essential product fields:

```graphql
fragment ProductFragment on Product {
  id, title, handle, description, descriptionHtml
  vendor, productType, tags
  createdAt, updatedAt, publishedAt
  availableForSale
  priceRange { minVariantPrice, maxVariantPrice }
  compareAtPriceRange { minVariantPrice, maxVariantPrice }
  featuredImage { url, altText, width, height }
  images (first: 20) { ... }
  variants (first: 100) { ... }
  options { name, values }
}
```

### Usage Example

```typescript
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_COLLECTION_BY_HANDLE_QUERY } from "~/lib/queries";

const data = await storefrontFetch(
  GET_COLLECTION_BY_HANDLE_QUERY,
  { handle: "apparel", first: 20 }
);

const collection = data.collection;
```

---

## 3. Product Mapper
**File:** `app/lib/productMapper.ts`

### Overview
Transforms Shopify Storefront API responses into our standardized product template format. Ensures consistent data structure throughout the application.

### Main Function: `mapProduct()`

```typescript
mapProduct(shopifyProduct: ShopifyProduct): MappedProduct
```

**Input:** Shopify Storefront API product object  
**Output:** Standardized product template object

### Price Field Derivation

#### `price_min` / `price_max`
```typescript
price_min = moneyToCents(priceRange.minVariantPrice)
price_max = moneyToCents(priceRange.maxVariantPrice)
```
- **Source:** `priceRange.minVariantPrice.amount` and `maxVariantPrice.amount`
- **Purpose:** Lowest and highest price across all variants
- **Conversion:** Decimal string → Integer cents via `moneyToCents()`
- **Example:** `"68.00"` → `6800` (cents)

#### `price_varies`
```typescript
price_varies = price_min !== price_max
```
- **Calculation:** Direct comparison of min and max prices
- **Returns:** `true` if variants have different prices, `false` if same
- **Use Case:** Display "From $X" or "Price varies" messaging

#### `compare_at_price_min` / `compare_at_price_max`
```typescript
compare_at_price_min = moneyToCents(compareAtPriceRange?.minVariantPrice)
compare_at_price_max = moneyToCents(compareAtPriceRange?.maxVariantPrice)
```
- **Source:** `compareAtPriceRange` (optional field)
- **Purpose:** Original/MSRP prices before discounts
- **Default:** Returns `0` if no `compareAtPriceRange` exists
- **Use Case:** Show "Was $X, Now $Y" and calculate savings

#### `compare_at_price_varies`
```typescript
compare_at_price_varies = compare_at_price_min !== compare_at_price_max
```
- **Calculation:** Same logic as `price_varies` but for compare-at prices
- **Use Case:** Display "Up to X% off" messaging

#### Base Price Fields
```typescript
price = price_min              // "Starting at" price
compare_at_price = compare_at_price_min  // "Was" price
```

### Helper Functions

#### `moneyToCents(money: ShopifyMoney): number`
Converts Shopify money string to integer cents.

**Example:**
```typescript
moneyToCents({ amount: "68.00", currencyCode: "USD" }) // → 6800
moneyToCents({ amount: "0.99", currencyCode: "USD" })  // → 99
moneyToCents(undefined) // → 0
```

**Implementation:**
```typescript
return Math.round(parseFloat(money.amount) * 100);
```

#### `extractNumericId(gid: string): number | string`
Extracts numeric ID from Shopify Global ID format.

**Example:**
```typescript
extractNumericId("gid://shopify/Product/123456") // → 123456
extractNumericId("gid://shopify/Variant/789")    // → 789
```

### Mapping Process

The `mapProduct()` function performs these transformations:

1. **Map Variants** → Extract options, prices, availability
2. **Map Images** → Convert to URL array, set featured image
3. **Map Media** → Create gallery with aspect ratios
4. **Map Options** → Extract size/color/type options with positions
5. **Calculate Prices** → Derive all price fields in cents
6. **Build Final Object** → Assemble complete product template

### Additional Functions

#### `mapProducts(products: Array<{ node: ShopifyProduct }>): MappedProduct[]`
Maps multiple products from Shopify edges format.

#### `mapCollection(collection: any)`
Maps collection data including nested products.

### Usage Example

```typescript
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "~/lib/queries";
import { mapProduct } from "~/lib/productMapper";

// 1. Fetch from Shopify API
const data = await storefrontFetch(
  GET_PRODUCT_BY_HANDLE_QUERY,
  { handle: "cool-t-shirt" }
);

// 2. Map to our template
const product = mapProduct(data.product);

// 3. Use standardized product data
console.log(product.id);           // 123456
console.log(product.price);         // 6800 (cents)
console.log(product.price_varies);  // true/false
console.log(product.variants[0].option1); // "Small"
```

---

## 🔄 Complete Data Flow

```
┌─────────────┐
│   Route     │ (e.g., products.$handle.tsx)
└──────┬──────┘
       │ 1. Import query and mapper
       ↓
┌─────────────────────┐
│  storefrontFetch()  │ (shopifyStorefront.server.ts)
└──────┬──────────────┘
       │ 2. Execute GraphQL query
       ↓
┌──────────────┐
│ Shopify API  │ (Storefront API)
└──────┬───────┘
       │ 3. Return raw product data
       ↓
┌─────────────────┐
│  mapProduct()   │ (productMapper.ts)
└──────┬──────────┘
       │ 4. Transform to template
       ↓
┌──────────────────┐
│ Component Render │ (Cards.tsx, CardOverview.tsx, etc.)
└──────────────────┘
```

---

## 📊 Type Definitions

### Shopify Types (Input)

```typescript
interface ShopifyMoney {
  amount: string;        // "68.00"
  currencyCode: string;  // "USD"
}

interface ShopifyProduct {
  id: string;                    // "gid://shopify/Product/123"
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  // ... more fields
}
```

### Mapped Types (Output)

```typescript
interface MappedProduct {
  id: number | string;   // 123456
  title: string;
  handle: string;
  price: number;         // 6800 (cents)
  price_min: number;
  price_max: number;
  price_varies: boolean;
  variants: ProductVariant[];
  // ... more fields
}
```

---

## 🎯 Key Design Decisions

### 1. **Cents vs Dollars**
All prices stored as **integer cents** to avoid floating-point precision issues.
- ✅ Accurate calculations
- ✅ No rounding errors
- ✅ Easy to format with `formatMoney()` helper

### 2. **Price Fields**
Separate min/max fields enable flexible UI:
- Show "From $X" when `price_varies === true`
- Display single price when all variants same price
- Calculate discounts: `(compare_at_price - price) / compare_at_price`

### 3. **GID Handling**
Shopify uses Global IDs (`gid://shopify/Product/123`):
- Extract numeric portion for cleaner IDs
- Fall back to string if parsing fails
- Keeps compatibility with template

### 4. **OAuth Caching**
Token cached for 23 hours (not 24):
- Prevents expiration race conditions
- Reduces API calls
- Improves performance

### 5. **Type Safety**
Full TypeScript coverage:
- Prevents runtime errors
- Better IDE autocomplete
- Self-documenting code

---

## 🧪 Testing the Implementation

### Test Product Fetch
```typescript
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCTS_QUERY } from "~/lib/queries";
import { mapProducts } from "~/lib/productMapper";

const data = await storefrontFetch(GET_PRODUCTS_QUERY, { first: 5 });
const products = mapProducts(data.products.edges);

console.log(`Fetched ${products.length} products`);
console.log(`First product: ${products[0].title} - $${products[0].price / 100}`);
```

### Test Cart Creation
```typescript
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { CREATE_CART_MUTATION } from "~/lib/queries";

const data = await storefrontFetch(CREATE_CART_MUTATION, {
  input: {
    lines: [
      { merchandiseId: "gid://shopify/ProductVariant/123", quantity: 1 }
    ]
  }
});

console.log(`Cart created: ${data.cartCreate.cart.id}`);
console.log(`Checkout URL: ${data.cartCreate.cart.checkoutUrl}`);
```

---

## 📚 Related Files

- **[money.ts](app/lib/money.ts)** - Currency formatting utilities
- **[filters.ts](app/lib/filters.ts)** - Product filtering logic
- **[SHOPIFY_SETUP.md](SHOPIFY_SETUP.md)** - Credentials setup guide
- **[README.md](README.md)** - Project documentation

---

## ✅ Implementation Checklist

- [x] `storefrontFetch<T>()` function with OAuth support
- [x] Environment variable configuration (`.env`)
- [x] Product list query with pagination
- [x] Product by handle query
- [x] Collection queries
- [x] Search functionality
- [x] Cart create/add/update/remove mutations
- [x] Checkout URL retrieval
- [x] Complete product mapping with all template fields
- [x] Price calculation logic (min/max/varies)
- [x] `moneyToCents()` helper function
- [x] Type definitions for all interfaces
- [x] Comprehensive documentation
- [x] Error handling throughout

---

**Implementation Status:** ✅ Complete and Production-Ready

All three files are fully implemented, type-safe, and ready for use in the Shopify storefront application.
