/**
 * Product Mapper for Shopify Storefront API
 * 
 * Maps Shopify Storefront API responses to our standardized product template.
 * This ensures consistent product data structure throughout the application.
 * 
 * === PRICE FIELD DERIVATION ===
 * 
 * price_min / price_max:
 *   - Derived from priceRange.minVariantPrice.amount and priceRange.maxVariantPrice.amount
 *   - Represents the lowest and highest price among all product variants
 *   - Converted from decimal string to integer cents using moneyToCents()
 *   - Example: "68.00" → 6800 (cents)
 * 
 * price_varies:
 *   - Boolean indicating if variants have different prices
 *   - Calculated by comparing: price_min !== price_max
 *   - true = product has multiple price points across variants
 *   - false = all variants have the same price
 * 
 * compare_at_price_min / compare_at_price_max:
 *   - Derived from compareAtPriceRange.minVariantPrice.amount and maxVariantPrice.amount
 *   - Represents original/MSRP prices before discounts
 *   - Returns 0 if no compareAtPriceRange exists (no sale)
 *   - Used to calculate discount percentages and show savings
 * 
 * compare_at_price_varies:
 *   - Boolean indicating if compare-at prices vary across variants
 *   - Calculated same way as price_varies but for compareAt prices
 *   - Useful for showing "Up to X% off" messaging
 * 
 * price (base):
 *   - Set to price_min by default
 *   - Represents the "starting at" price shown on cards
 * 
 * compare_at_price (base):
 *   - Set to compare_at_price_min by default
 *   - Represents the "was" price for sale calculations
 */

/**
 * Helper: Convert Shopify money string to integer cents
 * @param money - Shopify money object with amount and currencyCode
 * @returns Amount in cents (e.g., "68.00" → 6800)
 */
export function moneyToCents(money: ShopifyMoney | undefined | null): number {
  if (!money || !money.amount) return 0;
  return Math.round(parseFloat(money.amount) * 100);
}

/**
 * Helper: Extract numeric ID from Shopify GID
 * Shopify uses global IDs like "gid://shopify/Product/123456"
 * This extracts the numeric portion: 123456
 * 
 * @param gid - Shopify global ID string
 * @returns Numeric ID or the original string if not parseable
 */
export function extractNumericId(gid: string): number | string {
  const parts = gid.split("/");
  const numericPart = parts[parts.length - 1];
  const parsed = parseInt(numericPart, 10);
  return isNaN(parsed) ? numericPart : parsed;
}

// ============================================================================
// TYPE DEFINITIONS - Shopify Storefront API Response Schema
// ============================================================================

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney | null;
  image?: ShopifyImage | null;
  sku?: string | null;
  barcode?: string | null;
  weight?: number | null;
  weightUnit?: string | null;
  requiresShipping?: boolean;
  taxable?: boolean;
}

export interface ShopifyProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  publishedAt: string | null;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  } | null;
  featuredImage?: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  options: ShopifyProductOption[];
}

// ============================================================================
// TYPE DEFINITIONS - Our Product Template Schema
// ============================================================================

export interface ProductVariant {
  id: number | string;
  title: string;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string | null;
  requires_shipping: boolean;
  taxable: boolean;
  featured_image: {
    src: string;
    alt: string | null;
    width: number;
    height: number;
  } | null;
  available: boolean;
  name: string;
  public_title: string | null;
  options: string[];
  price: number;
  weight: number | null;
  compare_at_price: number;
  inventory_management: string | null;
  barcode: string | null;
  quantity_rule: {
    min: number;
    max: number | null;
    increment: number;
  };
  quantity_price_breaks: any[];
  requires_selling_plan: boolean;
  selling_plan_allocations: any[];
}

export interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

export interface ProductMedia {
  alt: string | null;
  id: number | string;
  position: number;
  preview_image: {
    aspect_ratio: number;
    height: number;
    width: number;
    src: string;
  };
  aspect_ratio: number;
  height: number;
  media_type: string;
  src: string;
  width: number;
}

export interface MappedProduct {
  id: number | string;
  title: string;
  handle: string;
  description: string;
  published_at: string | null;
  created_at: string;
  updated_at?: string;
  vendor: string;
  type: string;
  tags: string[];

  // Price fields (in cents)
  price: number;
  price_min: number;
  price_max: number;
  available: boolean;
  price_varies: boolean;

  // Compare at price fields (in cents)
  compare_at_price: number;
  compare_at_price_min: number;
  compare_at_price_max: number;
  compare_at_price_varies: boolean;

  // Variants
  variants: ProductVariant[];

  // Images
  images: string[];
  featured_image: string;

  // Options
  options: ProductOption[];

  // URL
  url: string;

  // Media
  media: ProductMedia[];

  // Selling plans (optional)
  requires_selling_plan: boolean;
  selling_plan_groups: any[];
}

// ============================================================================
// MAIN MAPPING FUNCTION
// ============================================================================

/**
 * Map Shopify Storefront API product to our standardized template
 * 
 * @param shopifyProduct - Product data from Shopify Storefront API
 * @returns Mapped product in our template format
 */
export function mapProduct(shopifyProduct: ShopifyProduct): MappedProduct {
  // -------------------------------------------------------------------------
  // 1. MAP VARIANTS
  // -------------------------------------------------------------------------
  const variants: ProductVariant[] = shopifyProduct.variants.edges.map(({ node }) => {
    // Extract option values from selectedOptions
    const option1 = node.selectedOptions[0]?.value || null;
    const option2 = node.selectedOptions[1]?.value || null;
    const option3 = node.selectedOptions[2]?.value || null;

    return {
      id: extractNumericId(node.id),
      title: node.title,
      option1,
      option2,
      option3,
      sku: node.sku || null,
      requires_shipping: node.requiresShipping ?? true,
      taxable: node.taxable ?? true,
      featured_image: node.image
        ? {
            src: node.image.url,
            alt: node.image.altText,
            width: node.image.width,
            height: node.image.height,
          }
        : null,
      available: node.availableForSale,
      name: `${shopifyProduct.title} - ${node.title}`,
      public_title: node.title !== "Default Title" ? node.title : null,
      options: node.selectedOptions.map((opt) => opt.value),
      price: moneyToCents(node.price),
      weight: node.weight || null,
      compare_at_price: moneyToCents(node.compareAtPrice),
      inventory_management: "shopify",
      barcode: node.barcode || null,
      quantity_rule: {
        min: 1,
        max: null,
        increment: 1,
      },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: [],
    };
  });

  // -------------------------------------------------------------------------
  // 2. MAP IMAGES
  // -------------------------------------------------------------------------
  const images: string[] = shopifyProduct.images.edges.map(({ node }) => node.url);
  const featuredImage = shopifyProduct.featuredImage?.url || images[0] || "";

  // -------------------------------------------------------------------------
  // 3. MAP MEDIA (for gallery/detail views)
  // -------------------------------------------------------------------------
  const media: ProductMedia[] = shopifyProduct.images.edges.map(({ node }, index) => {
    const aspectRatio = node.width && node.height ? node.width / node.height : 1;
    
    return {
      alt: node.altText,
      id: extractNumericId(node.id),
      position: index + 1,
      preview_image: {
        aspect_ratio: aspectRatio,
        height: node.height,
        width: node.width,
        src: node.url,
      },
      aspect_ratio: aspectRatio,
      height: node.height,
      media_type: "image",
      src: node.url,
      width: node.width,
    };
  });

  // -------------------------------------------------------------------------
  // 4. MAP OPTIONS
  // -------------------------------------------------------------------------
  const options: ProductOption[] = shopifyProduct.options.map((opt, index) => ({
    name: opt.name,
    position: index + 1,
    values: opt.values,
  }));

  // -------------------------------------------------------------------------
  // 5. CALCULATE PRICE FIELDS
  // -------------------------------------------------------------------------
  // Price range from Shopify priceRange
  const price_min = moneyToCents(shopifyProduct.priceRange.minVariantPrice);
  const price_max = moneyToCents(shopifyProduct.priceRange.maxVariantPrice);
  const price_varies = price_min !== price_max;

  // Compare at price range (for sale pricing)
  const compareAtRange = shopifyProduct.compareAtPriceRange;
  const compare_at_price_min = moneyToCents(compareAtRange?.minVariantPrice);
  const compare_at_price_max = moneyToCents(compareAtRange?.maxVariantPrice);
  const compare_at_price_varies = 
    compareAtRange ? compare_at_price_min !== compare_at_price_max : false;

  // -------------------------------------------------------------------------
  // 6. BUILD FINAL PRODUCT OBJECT
  // -------------------------------------------------------------------------
  return {
    // Basic Info
    id: extractNumericId(shopifyProduct.id),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.descriptionHtml || shopifyProduct.description,
    published_at: shopifyProduct.publishedAt,
    created_at: shopifyProduct.createdAt,
    updated_at: shopifyProduct.updatedAt,
    vendor: shopifyProduct.vendor,
    type: shopifyProduct.productType,
    tags: shopifyProduct.tags,

    // Price Fields (all in cents)
    price: price_min, // "Starting at" price
    price_min,
    price_max,
    available: shopifyProduct.availableForSale,
    price_varies,

    // Compare At Price Fields (all in cents)
    compare_at_price: compare_at_price_min, // "Was" price
    compare_at_price_min,
    compare_at_price_max,
    compare_at_price_varies,

    // Variants
    variants,

    // Images
    images,
    featured_image: featuredImage,

    // Options
    options,

    // URL
    url: `/products/${shopifyProduct.handle}`,

    // Media
    media,

    // Selling Plans (not commonly used in basic storefronts)
    requires_selling_plan: false,
    selling_plan_groups: [],
  };
}

/**
 * Map multiple products from Shopify API response
 * 
 * @param products - Array of Shopify products from edges
 * @returns Array of mapped products
 */
export function mapProducts(
  products: Array<{ node: ShopifyProduct }>
): MappedProduct[] {
  return products.map(({ node }) => mapProduct(node));
}

/**
 * Map collection from Shopify API response
 * 
 * @param collection - Shopify collection data
 * @returns Mapped collection with products
 */
export function mapCollection(collection: any) {
  return {
    id: extractNumericId(collection.id),
    title: collection.title,
    handle: collection.handle,
    description: collection.descriptionHtml || collection.description || "",
    image: collection.image
      ? {
          url: collection.image.url,
          altText: collection.image.altText,
          width: collection.image.width,
          height: collection.image.height,
        }
      : null,
    products: collection.products?.edges
      ? mapProducts(collection.products.edges)
      : [],
  };
}
