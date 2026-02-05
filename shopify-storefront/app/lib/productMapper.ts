/**
 * Product Mapper
 * Maps Shopify Storefront API responses to our product template structure
 */

interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  image?: ShopifyImage;
  sku?: string;
  weight?: number;
  weightUnit?: string;
}

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  createdAt: string;
  publishedAt: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  compareAtPriceRange?: {
    minVariantPrice: ShopifyMoney;
    maxVariantPrice: ShopifyMoney;
  };
  featuredImage?: ShopifyImage;
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
  options: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

/**
 * Convert Shopify money string to cents (integer)
 */
function moneyToCents(money: ShopifyMoney | undefined): number {
  if (!money) return 0;
  return Math.round(parseFloat(money.amount) * 100);
}

/**
 * Map Shopify product to our template structure
 */
export function mapProduct(shopifyProduct: ShopifyProduct) {
  const variants = shopifyProduct.variants.edges.map(({ node }) => ({
    id: extractNumericId(node.id),
    title: node.title,
    option1: node.selectedOptions[0]?.value || null,
    option2: node.selectedOptions[1]?.value || null,
    option3: node.selectedOptions[2]?.value || null,
    sku: node.sku || null,
    requires_shipping: true,
    taxable: true,
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
    barcode: null,
    quantity_rule: {
      min: 1,
      max: null,
      increment: 1,
    },
    quantity_price_breaks: [],
    requires_selling_plan: false,
    selling_plan_allocations: [],
  }));

  const images = shopifyProduct.images.edges.map(({ node }) => node.url);

  const media = shopifyProduct.images.edges.map(({ node }, index) => ({
    alt: node.altText,
    id: extractNumericId(node.id),
    position: index + 1,
    preview_image: {
      aspect_ratio: node.width / node.height,
      height: node.height,
      width: node.width,
      src: node.url,
    },
    aspect_ratio: node.width / node.height,
    height: node.height,
    media_type: "image",
    src: node.url,
    width: node.width,
  }));

  const options = shopifyProduct.options.map((opt, index) => ({
    name: opt.name,
    position: index + 1,
    values: opt.values,
  }));

  return {
    id: extractNumericId(shopifyProduct.id),
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description,
    published_at: shopifyProduct.publishedAt,
    created_at: shopifyProduct.createdAt,
    vendor: shopifyProduct.vendor,
    type: shopifyProduct.productType,
    tags: shopifyProduct.tags,

    price: moneyToCents(shopifyProduct.priceRange.minVariantPrice),
    price_min: moneyToCents(shopifyProduct.priceRange.minVariantPrice),
    price_max: moneyToCents(shopifyProduct.priceRange.maxVariantPrice),
    available: shopifyProduct.availableForSale,
    price_varies:
      shopifyProduct.priceRange.minVariantPrice.amount !==
      shopifyProduct.priceRange.maxVariantPrice.amount,

    compare_at_price: shopifyProduct.compareAtPriceRange
      ? moneyToCents(shopifyProduct.compareAtPriceRange.minVariantPrice)
      : 0,
    compare_at_price_min: shopifyProduct.compareAtPriceRange
      ? moneyToCents(shopifyProduct.compareAtPriceRange.minVariantPrice)
      : 0,
    compare_at_price_max: shopifyProduct.compareAtPriceRange
      ? moneyToCents(shopifyProduct.compareAtPriceRange.maxVariantPrice)
      : 0,
    compare_at_price_varies: shopifyProduct.compareAtPriceRange
      ? shopifyProduct.compareAtPriceRange.minVariantPrice.amount !==
        shopifyProduct.compareAtPriceRange.maxVariantPrice.amount
      : false,

    variants,
    images,
    featured_image: shopifyProduct.featuredImage?.url || images[0] || "",
    options,
    url: `/products/${shopifyProduct.handle}`,
    media,

    requires_selling_plan: false,
    selling_plan_groups: [],
  };
}

/**
 * Extract numeric ID from Shopify GID
 * e.g., "gid://shopify/Product/123456" -> 123456
 */
function extractNumericId(gid: string): number {
  const parts = gid.split("/");
  return parseInt(parts[parts.length - 1], 10);
}
