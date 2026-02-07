/**
 * Test script to verify Shopify Storefront API authentication
 * Run with: npx tsx scripts/testStorefrontAuth.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file FIRST
const envResult = dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (envResult.error) {
  console.error("Failed to load .env file:", envResult.error);
  process.exit(1);
}

console.log("Environment variables loaded:");
console.log(`  SHOPIFY_STORE_DOMAIN: ${process.env.SHOPIFY_STORE_DOMAIN || 'NOT SET'}`);
console.log(`  SHOPIFY_STOREFRONT_ACCESS_TOKEN: ${process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ? 'SET' : 'NOT SET'}`);
console.log();

// Now import the storefront module
const { storefrontFetch, isShopifyConfigured, getAuthMethod } = await import("../app/lib/shopifyStorefront.server");

async function testStorefrontConnection() {
  console.log("=".repeat(60));
  console.log("Shopify Storefront API Authentication Test");
  console.log("=".repeat(60));
  console.log();

  // Check if configured
  if (!isShopifyConfigured()) {
    console.error("❌ Shopify is not configured!");
    process.exit(1);
  }

  const authMethod = getAuthMethod();
  console.log(`Authentication method: ${authMethod.toUpperCase()}`);
  console.log();

  try {
    // Test query to get shop information
    console.log("Testing Storefront API connection...");
    const query = `
      query {
        shop {
          name
          primaryDomain {
            url
          }
        }
      }
    `;

    const result = await storefrontFetch<{
      shop: {
        name: string;
        primaryDomain: {
          url: string;
        };
      };
    }>(query);

    console.log();
    console.log("✅ Successfully authenticated with Storefront API!");
    console.log();
    console.log("Store Information:");
    console.log("-".repeat(60));
    console.log(`  Shop Name:     ${result.shop.name}`);
    console.log(`  Primary URL:   ${result.shop.primaryDomain.url}`);
    console.log("-".repeat(60));
    console.log();

    // Try to fetch products to test permissions
    console.log("Testing product access...");
    const productsQuery = `
      query {
        products(first: 5) {
          edges {
            node {
              id
              title
              handle
              availableForSale
            }
          }
        }
      }
    `;

    const productsResult = await storefrontFetch<{
      products: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            handle: string;
            availableForSale: boolean;
          };
        }>;
      };
    }>(productsQuery);

    const productCount = productsResult.products.edges.length;
    console.log();
    console.log("Product Access Test:");
    console.log("-".repeat(60));
    console.log(`  Products found: ${productCount}`);
    if (productCount > 0) {
      console.log(`  Sample products:`);
      productsResult.products.edges.slice(0, 3).forEach((edge) => {
        console.log(`    - ${edge.node.title} (${edge.node.handle})`);
      });
    }
    console.log("-".repeat(60));
    console.log();

    console.log("✅ Storefront API access token is working correctly!");
    console.log();
    console.log("You can now use the Storefront API to:");
    console.log("  • Fetch products and collections");
    console.log("  • Create and manage carts");
    console.log("  • Process checkouts");
    console.log("  • Query shop information");
    console.log("  • And more!");

  } catch (error) {
    console.log();
    console.log("❌ Storefront API test failed!");
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    console.log();
    console.log("Troubleshooting:");
    console.log("  1. Verify SHOPIFY_STOREFRONT_ACCESS_TOKEN is correct in .env");
    console.log("  2. Check that the token has Storefront API permissions");
    console.log("  3. Ensure your custom app is installed and active");
    console.log("  4. Verify SHOPIFY_STORE_DOMAIN matches your store");
    process.exit(1);
  }

  console.log();
  console.log("=".repeat(60));
}

testStorefrontConnection().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
