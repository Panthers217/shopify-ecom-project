/**
 * Import Mock Collections and Products via Shopify Admin GraphQL API
 * Run with: npx tsx scripts/importMockData.ts
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables BEFORE importing modules that use them
const envPath = path.resolve(__dirname, "../.env");
console.log(`Loading .env from: ${envPath}`);
const result = config({ path: envPath });

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
} else {
  console.log("✅ .env file loaded successfully");
  console.log(`SHOPIFY_STORE_DOMAIN: ${process.env.SHOPIFY_STORE_DOMAIN}`);
  console.log(`SHOPIFY_ADMIN_ACCESS_TOKEN: ${process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.substring(0, 10)}...`);
}

// Use dynamic import to load adminFetch AFTER environment variables are set
const { adminFetch } = await import("../app/lib/shopifyAdmin.server.js");

// ============================================================================
// GRAPHQL MUTATIONS & QUERIES
// ============================================================================

const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          id
          title
          handle
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const CREATE_COLLECTION_MUTATION = `
  mutation createCollection($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        title
        handle
        descriptionHtml
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CREATE_PRODUCT_MUTATION = `
  mutation createProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        title
        handle
        descriptionHtml
        vendor
        productType
        tags
        status
        variants(first: 100) {
          edges {
            node {
              id
              title
              sku
              price
              compareAtPrice
              inventoryQuantity
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_PRODUCTS_TO_COLLECTION_MUTATION = `
  mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      collection {
        id
        title
        productsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// ============================================================================
// MOCK DATA DEFINITIONS
// ============================================================================

interface Collection {
  title: string;
  handle: string;
  description: string;
}

interface ProductVariant {
  options: string[];
  sku: string;
  price: string;
  compareAtPrice?: string;
  inventoryQuantity: number;
  weight: number;
}

interface Product {
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  options: string[];
  variants: ProductVariant[];
  collections: string[];
  status: "ACTIVE" | "DRAFT";
}

const COLLECTIONS: Collection[] = [
  {
    title: "Apparel",
    handle: "apparel",
    description: "Explore our latest clothing collection featuring tops, bottoms, and outerwear",
  },
  {
    title: "Accessories",
    handle: "accessories",
    description: "Complete your look with our curated selection of bags, belts, and more",
  },
  {
    title: "Jewelry",
    handle: "jewelry",
    description: "Elegant pieces for every occasion - from everyday essentials to statement pieces",
  },
  {
    title: "Shoes",
    handle: "shoes",
    description: "Step up your style game with our footwear collection",
  },
  {
    title: "Sale",
    handle: "sale",
    description: "Amazing deals you don't want to miss - limited time offers on select items",
  },
  {
    title: "Women",
    handle: "women",
    description: "Fashion for her - discover the latest trends in women's fashion",
  },
  {
    title: "Men",
    handle: "men",
    description: "Fashion for him - quality menswear for every occasion",
  },
  {
    title: "Kids",
    handle: "kids",
    description: "Fun styles for children - comfortable and durable clothing for active kids",
  },
  {
    title: "Bestseller",
    handle: "bestseller",
    description: "Our most popular items - customer favorites that keep selling out",
  },
];

const PRODUCTS: Product[] = [
  {
    title: "Classic Cotton T-Shirt",
    handle: "classic-cotton-tshirt",
    description: "<p>Comfortable everyday cotton t-shirt in multiple colors. Perfect for casual wear.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Apparel",
    tags: ["cotton", "casual", "everyday", "tshirt"],
    options: ["Size", "Color"],
    variants: [
      { options: ["Small", "White"], sku: "TSHIRT-SM-WHT", price: "29.99", compareAtPrice: "39.99", inventoryQuantity: 50, weight: 200 },
      { options: ["Medium", "White"], sku: "TSHIRT-MD-WHT", price: "29.99", compareAtPrice: "39.99", inventoryQuantity: 75, weight: 200 },
      { options: ["Large", "White"], sku: "TSHIRT-LG-WHT", price: "29.99", compareAtPrice: "39.99", inventoryQuantity: 60, weight: 200 },
      { options: ["Small", "Black"], sku: "TSHIRT-SM-BLK", price: "29.99", compareAtPrice: "39.99", inventoryQuantity: 45, weight: 200 },
      { options: ["Medium", "Black"], sku: "TSHIRT-MD-BLK", price: "29.99", compareAtPrice: "39.99", inventoryQuantity: 80, weight: 200 },
    ],
    collections: ["apparel", "bestseller", "women", "men", "sale"],
    status: "ACTIVE",
  },
  {
    title: "Leather Crossbody Bag",
    handle: "leather-crossbody-bag",
    description: "<p>Premium leather bag with adjustable strap. Perfect for everyday use or special occasions.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Accessories",
    tags: ["leather", "bag", "luxury"],
    options: ["Color"],
    variants: [
      { options: ["Brown"], sku: "BAG-BROWN", price: "129.99", inventoryQuantity: 15, weight: 500 },
      { options: ["Black"], sku: "BAG-BLACK", price: "129.99", inventoryQuantity: 20, weight: 500 },
    ],
    collections: ["accessories", "women", "bestseller"],
    status: "ACTIVE",
  },
  {
    title: "Gold Hoop Earrings",
    handle: "gold-hoop-earrings",
    description: "<p>Elegant 14k gold plated hoop earrings. Hypoallergenic and nickel-free.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Jewelry",
    tags: ["gold", "earrings", "elegant"],
    options: ["Size"],
    variants: [
      { options: ["Small"], sku: "EARRING-SM-GOLD", price: "49.99", compareAtPrice: "79.99", inventoryQuantity: 30, weight: 10 },
      { options: ["Medium"], sku: "EARRING-MD-GOLD", price: "49.99", compareAtPrice: "79.99", inventoryQuantity: 25, weight: 12 },
      { options: ["Large"], sku: "EARRING-LG-GOLD", price: "49.99", compareAtPrice: "79.99", inventoryQuantity: 20, weight: 15 },
    ],
    collections: ["jewelry", "women", "sale"],
    status: "ACTIVE",
  },
  {
    title: "Running Shoes",
    handle: "running-shoes",
    description: "<p>Lightweight running shoes with superior cushioning and breathable mesh upper.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Shoes",
    tags: ["running", "athletic", "sports"],
    options: ["Size", "Color"],
    variants: [
      { options: ["7", "Blue"], sku: "SHOE-7-BLUE", price: "89.99", inventoryQuantity: 15, weight: 400 },
      { options: ["8", "Blue"], sku: "SHOE-8-BLUE", price: "89.99", inventoryQuantity: 20, weight: 400 },
      { options: ["9", "Blue"], sku: "SHOE-9-BLUE", price: "89.99", inventoryQuantity: 25, weight: 400 },
      { options: ["10", "Blue"], sku: "SHOE-10-BLUE", price: "89.99", inventoryQuantity: 18, weight: 400 },
    ],
    collections: ["shoes", "men", "women"],
    status: "ACTIVE",
  },
  {
    title: "Denim Jacket",
    handle: "denim-jacket",
    description: "<p>Classic denim jacket with vintage wash. Timeless style that never goes out of fashion.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Apparel",
    tags: ["denim", "jacket", "casual"],
    options: ["Size"],
    variants: [
      { options: ["Small"], sku: "JACKET-SM", price: "69.99", compareAtPrice: "99.99", inventoryQuantity: 12, weight: 600 },
      { options: ["Medium"], sku: "JACKET-MD", price: "69.99", compareAtPrice: "99.99", inventoryQuantity: 18, weight: 600 },
      { options: ["Large"], sku: "JACKET-LG", price: "69.99", compareAtPrice: "99.99", inventoryQuantity: 15, weight: 650 },
      { options: ["X-Large"], sku: "JACKET-XL", price: "74.99", compareAtPrice: "99.99", inventoryQuantity: 10, weight: 700 },
    ],
    collections: ["apparel", "men", "women", "sale"],
    status: "ACTIVE",
  },
  {
    title: "Aviator Sunglasses",
    handle: "sunglasses-aviator",
    description: "<p>UV protection polarized sunglasses with classic aviator style.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Accessories",
    tags: ["sunglasses", "eyewear", "protection"],
    options: ["Style"],
    variants: [
      { options: ["Aviator"], sku: "GLASSES-AVIATOR", price: "39.99", compareAtPrice: "59.99", inventoryQuantity: 40, weight: 50 },
    ],
    collections: ["accessories", "men", "women", "sale"],
    status: "ACTIVE",
  },
  {
    title: "Kids Graphic Tee",
    handle: "kids-graphic-tee",
    description: "<p>Fun graphic t-shirt for kids with colorful designs. Soft and comfortable cotton blend.</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Apparel",
    tags: ["kids", "tshirt", "graphic"],
    options: ["Size"],
    variants: [
      { options: ["4T"], sku: "KIDS-TEE-4T", price: "19.99", inventoryQuantity: 30, weight: 150 },
      { options: ["5T"], sku: "KIDS-TEE-5T", price: "19.99", inventoryQuantity: 35, weight: 160 },
      { options: ["6T"], sku: "KIDS-TEE-6T", price: "19.99", inventoryQuantity: 28, weight: 170 },
    ],
    collections: ["kids", "apparel"],
    status: "ACTIVE",
  },
  {
    title: "Bestseller Bundle",
    handle: "bestseller-bundle",
    description: "<p>Our top 3 most popular items bundled together at a special price. Save 25% when you buy the bundle!</p>",
    vendor: "Evergreen Apparel Co",
    productType: "Bundle",
    tags: ["bestseller", "bundle", "popular"],
    options: [],
    variants: [
      { options: [], sku: "BUNDLE-001", price: "149.99", compareAtPrice: "199.99", inventoryQuantity: 10, weight: 1000 },
    ],
    collections: ["bestseller", "sale"],
    status: "ACTIVE",
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Rate limiting configuration for Shopify Admin API
 * GraphQL API has a cost-based system, but we'll use conservative delays
 */
const RATE_LIMIT = {
  BATCH_SIZE: 5, // Process items in batches
  BATCH_DELAY_MS: 2000, // Wait 2 seconds between batches
  OPERATION_DELAY_MS: 500, // Wait 500ms between individual operations
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Fetch all existing collections from Shopify
 */
async function getExistingCollections(): Promise<Map<string, string>> {
  console.log("🔍 Fetching existing collections...");
  const collectionsMap = new Map<string, string>();
  let hasNextPage = true;
  let cursor: string | null = null;
  let totalCount = 0;

  try {
    while (hasNextPage) {
      const response: {
        collections: {
          edges: Array<{ node: { id: string; title: string; handle: string } }>;
          pageInfo: { hasNextPage: boolean; endCursor: string };
        };
      } = await adminFetch(GET_COLLECTIONS_QUERY, {
        first: 250,
        after: cursor,
      });

      const collections = response.collections.edges;
      collections.forEach(({ node }: { node: { id: string; title: string; handle: string } }) => {
        collectionsMap.set(node.handle, node.id);
        totalCount++;
      });

      hasNextPage = response.collections.pageInfo.hasNextPage;
      cursor = response.collections.pageInfo.endCursor;

      if (hasNextPage) {
        await delay(RATE_LIMIT.OPERATION_DELAY_MS);
      }
    }

    console.log(`✅ Found ${totalCount} existing collections\n`);
    return collectionsMap;
  } catch (error) {
    console.error("❌ Error fetching existing collections:", error);
    return collectionsMap;
  }
}

/**
 * Fetch all existing products from Shopify
 */
async function getExistingProducts(): Promise<Map<string, string>> {
  console.log("🔍 Fetching existing products...");
  const productsMap = new Map<string, string>();
  let hasNextPage = true;
  let cursor: string | null = null;
  let totalCount = 0;

  try {
    while (hasNextPage) {
      const response: {
        products: {
          edges: Array<{ node: { id: string; title: string; handle: string } }>;
          pageInfo: { hasNextPage: boolean; endCursor: string };
        };
      } = await adminFetch(GET_PRODUCTS_QUERY, {
        first: 250,
        after: cursor,
      });

      const products = response.products.edges;
      products.forEach(({ node }: { node: { id: string; title: string; handle: string } }) => {
        productsMap.set(node.handle, node.id);
        totalCount++;
      });

      hasNextPage = response.products.pageInfo.hasNextPage;
      cursor = response.products.pageInfo.endCursor;

      if (hasNextPage) {
        await delay(RATE_LIMIT.OPERATION_DELAY_MS);
      }
    }

    console.log(`✅ Found ${totalCount} existing products\n`);
    return productsMap;
  } catch (error) {
    console.error("❌ Error fetching existing products:", error);
    return productsMap;
  }
}

/**
 * Process items in batches with rate limiting
 */
async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  batchSize: number = RATE_LIMIT.BATCH_SIZE
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(items.length / batchSize);
    
    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
    
    // Process batch items sequentially with delays
    for (let j = 0; j < batch.length; j++) {
      const globalIndex = i + j;
      const result = await processor(batch[j], globalIndex);
      results.push(result);
      
      // Delay between operations within a batch
      if (j < batch.length - 1) {
        await delay(RATE_LIMIT.OPERATION_DELAY_MS);
      }
    }
    
    // Longer delay between batches
    if (i + batchSize < items.length) {
      console.log(`⏱️  Waiting ${RATE_LIMIT.BATCH_DELAY_MS}ms before next batch...`);
      await delay(RATE_LIMIT.BATCH_DELAY_MS);
    }
  }
  
  return results;
}

// ============================================================================
// MAIN IMPORT FUNCTIONS
// ============================================================================

async function createCollections(existingCollections: Map<string, string>) {
  console.log("\n📦 Creating Collections...\n");
  const collectionMap = new Map<string, string>(existingCollections);
  
  // Filter out collections that already exist
  const collectionsToCreate = COLLECTIONS.filter(collection => {
    if (existingCollections.has(collection.handle)) {
      console.log(`⏭️  Skipping "${collection.title}" - already exists (ID: ${existingCollections.get(collection.handle)})`);
      return false;
    }
    return true;
  });

  if (collectionsToCreate.length === 0) {
    console.log("\n✅ All collections already exist, skipping creation.\n");
    return collectionMap;
  }

  console.log(`\n🆕 ${collectionsToCreate.length} new collections to create\n`);

  // Process collections in batches
  await processBatch(
    collectionsToCreate,
    async (collection, index) => {
      try {
        console.log(`[${index + 1}/${collectionsToCreate.length}] Creating: ${collection.title} (${collection.handle})...`);
        
        const response = await adminFetch<{
          collectionCreate: {
            collection: { id: string; title: string; handle: string };
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>(CREATE_COLLECTION_MUTATION, {
          input: {
            title: collection.title,
            handle: collection.handle,
            descriptionHtml: collection.description,
          },
        });

        if (response.collectionCreate.userErrors.length > 0) {
          console.error(`❌ Errors:`, response.collectionCreate.userErrors.map(e => e.message).join(", "));
          return null;
        }

        const created = response.collectionCreate.collection;
        collectionMap.set(collection.handle, created.id);
        console.log(`✅ Created: ${created.title} - ID: ${created.id}`);
        return created;
      } catch (error) {
        console.error(`❌ Error creating ${collection.handle}:`, error);
        return null;
      }
    }
  );

  return collectionMap;
}

async function createProducts(
  collectionMap: Map<string, string>,
  existingProducts: Map<string, string>
) {
  console.log("\n🛍️  Creating Products...\n");
  const productCollectionMap = new Map<string, string[]>();

  // Filter out products that already exist
  const productsToCreate = PRODUCTS.filter(product => {
    if (existingProducts.has(product.handle)) {
      console.log(`⏭️  Skipping "${product.title}" - already exists (ID: ${existingProducts.get(product.handle)})`);
      // Still track for collection assignment
      const existingId = existingProducts.get(product.handle)!;
      productCollectionMap.set(existingId, product.collections);
      return false;
    }
    return true;
  });

  if (productsToCreate.length === 0) {
    console.log("\n✅ All products already exist, skipping creation.\n");
    return productCollectionMap;
  }

  console.log(`\n🆕 ${productsToCreate.length} new products to create\n`);

  // Process products in batches
  await processBatch(
    productsToCreate,
    async (product, index) => {
      try {
        console.log(`[${index + 1}/${productsToCreate.length}] Creating: ${product.title} (${product.handle})...`);
        console.log(`  - ${product.variants.length} variants`);
        console.log(`  - Collections: ${product.collections.join(", ")}`);

        // Build product input
        const productInput: any = {
          title: product.title,
          handle: product.handle,
          descriptionHtml: product.description,
          vendor: product.vendor,
          productType: product.productType,
          tags: product.tags,
          status: product.status,
        };

        // Add options
        if (product.options.length > 0) {
          productInput.productOptions = product.options.map((name, index) => ({
            name,
            position: index + 1,
            values: [
              ...new Set(
                product.variants.map(v => v.options[index]).filter(Boolean)
              ),
            ].map(value => ({ name: value })),
          }));
        }

        // Add variants
        productInput.variants = product.variants.map(variant => ({
          sku: variant.sku,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          inventoryQuantities: [
            {
              availableQuantity: variant.inventoryQuantity,
              locationId: "gid://shopify/Location/1", // Default location
            },
          ],
          weight: variant.weight,
          weightUnit: "GRAMS",
          requiresShipping: true,
          taxable: true,
          options: variant.options,
        }));

        const response = await adminFetch<{
          productCreate: {
            product: {
              id: string;
              title: string;
              handle: string;
              variants: {
                edges: Array<{ node: { id: string; title: string; sku: string } }>;
              };
            };
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>(CREATE_PRODUCT_MUTATION, {
          input: productInput,
        });

        if (response.productCreate.userErrors.length > 0) {
          console.error(`❌ Errors:`,
            response.productCreate.userErrors.map(e => `${e.field?.join(".")}: ${e.message}`).join(", ")
          );
          return null;
        }

        const created = response.productCreate.product;
        console.log(`✅ Created: ${created.title} - ID: ${created.id}`);
        console.log(`   Variants: ${created.variants.edges.length}`);

        // Store product->collections mapping for later
        productCollectionMap.set(created.id, product.collections);
        return created;
      } catch (error) {
        console.error(`❌ Error creating ${product.handle}:`, error);
        if (error instanceof Error) {
          console.error("   Details:", error.message);
        }
        return null;
      }
    }
  );

  return productCollectionMap;
}

async function addProductsToCollections(
  collectionMap: Map<string, string>,
  productCollectionMap: Map<string, string[]>
) {
  console.log("\n🔗 Adding Products to Collections...\n");

  // Group products by collection
  const collectionProducts = new Map<string, string[]>();
  
  for (const [productId, collectionHandles] of productCollectionMap.entries()) {
    for (const handle of collectionHandles) {
      if (!collectionProducts.has(handle)) {
        collectionProducts.set(handle, []);
      }
      collectionProducts.get(handle)!.push(productId);
    }
  }

  const collectionEntries = Array.from(collectionProducts.entries());
  
  if (collectionEntries.length === 0) {
    console.log("\n✅ No products to add to collections.\n");
    return;
  }

  console.log(`\n🔗 ${collectionEntries.length} collections to update\n`);

  // Process collection updates in batches
  await processBatch(
    collectionEntries,
    async ([handle, productIds], index) => {
      const collectionId = collectionMap.get(handle);
      if (!collectionId) {
        console.log(`⚠️  Collection "${handle}" not found, skipping...`);
        return null;
      }

      try {
        console.log(`[${index + 1}/${collectionEntries.length}] Adding ${productIds.length} products to: ${handle}...`);
        
        const response = await adminFetch<{
          collectionAddProducts: {
            collection: { id: string; title: string; productsCount: { count: number } };
            userErrors: Array<{ field: string[]; message: string }>;
          };
        }>(ADD_PRODUCTS_TO_COLLECTION_MUTATION, {
          id: collectionId,
          productIds,
        });

        if (response.collectionAddProducts.userErrors.length > 0) {
          console.error(`❌ Errors:`, response.collectionAddProducts.userErrors.map(e => e.message).join(", "));
          return null;
        }

        const updated = response.collectionAddProducts.collection;
        console.log(`✅ ${updated.title}: ${updated.productsCount.count} products`);
        return updated;
      } catch (error) {
        console.error(`❌ Error adding products to ${handle}:`, error);
        return null;
      }
    }
  );
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  console.log("=".repeat(80));
  console.log("🚀 IMPORTING MOCK DATA TO SHOPIFY VIA ADMIN GRAPHQL API");
  console.log("=".repeat(80));
  console.log("\n⚙️  Rate Limiting Configuration:");
  console.log(`   - Batch Size: ${RATE_LIMIT.BATCH_SIZE} items`);
  console.log(`   - Batch Delay: ${RATE_LIMIT.BATCH_DELAY_MS}ms`);
  console.log(`   - Operation Delay: ${RATE_LIMIT.OPERATION_DELAY_MS}ms`);

  try {
    // Step 0: Fetch existing data
    console.log("\n" + "=".repeat(80));
    console.log("STEP 0: Checking Existing Data");
    console.log("=".repeat(80));
    
    const existingCollections = await getExistingCollections();
    const existingProducts = await getExistingProducts();

    // Step 1: Create collections
    console.log("\n" + "=".repeat(80));
    console.log("STEP 1: Creating Collections");
    console.log("=".repeat(80));
    
    const collectionMap = await createCollections(existingCollections);
    const newCollectionsCount = collectionMap.size - existingCollections.size;
    console.log(`\n✅ Total collections: ${collectionMap.size} (${newCollectionsCount} newly created)`);

    // Step 2: Create products
    console.log("\n" + "=".repeat(80));
    console.log("STEP 2: Creating Products");
    console.log("=".repeat(80));
    
    const productCollectionMap = await createProducts(collectionMap, existingProducts);
    const totalProducts = productCollectionMap.size;
    const newProductsCount = PRODUCTS.length - existingProducts.size;
    console.log(`\n✅ Total products: ${totalProducts} (${Math.max(0, newProductsCount)} newly created)`);

    // Step 3: Add products to collections
    console.log("\n" + "=".repeat(80));
    console.log("STEP 3: Linking Products to Collections");
    console.log("=".repeat(80));
    
    await addProductsToCollections(collectionMap, productCollectionMap);

    console.log("\n" + "=".repeat(80));
    console.log("✨ IMPORT COMPLETE!");
    console.log("=".repeat(80));
    console.log("\n📊 Summary:");
    console.log(`   Collections: ${collectionMap.size} total (${existingCollections.size} existing, ${newCollectionsCount} new)`);
    console.log(`   Products: ${totalProducts} total (${existingProducts.size} existing, ${Math.max(0, newProductsCount)} new)`);
    console.log("\n📋 Next Steps:");
    console.log("1. Visit your Shopify Admin to verify products and collections");
    console.log("2. Refresh your storefront to see the new products");
    console.log("3. Test the search functionality");
    console.log("4. Add product images if needed\n");

  } catch (error) {
    console.error("\n❌ Fatal error during import:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
