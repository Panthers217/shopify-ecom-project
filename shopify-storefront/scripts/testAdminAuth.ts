/**
 * Test script to verify Shopify Admin API authentication
 * Run with: npx tsx scripts/testAdminAuth.ts
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
console.log(`  SHOPIFY_CLIENT_ID: ${process.env.SHOPIFY_CLIENT_ID ? 'SET' : 'NOT SET'}`);
console.log(`  SHOPIFY_CLIENT_SECRET: ${process.env.SHOPIFY_CLIENT_SECRET ? 'SET' : 'NOT SET'}`);
console.log();

// Now import the admin module
const { testAdminConnection, adminFetch, getAdminAuthMethod } = await import("../app/lib/shopifyAdmin.server");

async function main() {
  console.log("=".repeat(60));
  console.log("Shopify Admin API Authentication Test");
  console.log("=".repeat(60));
  console.log();

  // Check authentication method
  const authMethod = getAdminAuthMethod();
  console.log(`Authentication method: ${authMethod.toUpperCase()}`);
  console.log();

  if (authMethod === "none") {
    console.error("❌ No admin credentials configured!");
    console.error("Please set either:");
    console.error("  - SHOPIFY_ADMIN_ACCESS_TOKEN, or");
    console.error("  - SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET");
    process.exit(1);
  }

  // Test the connection
  console.log("Testing admin connection...");
  const result = await testAdminConnection();

  if (result.success && result.shopInfo) {
    console.log();
    console.log("✅ Successfully authenticated as Shopify Admin!");
    console.log();
    console.log("Store Information:");
    console.log("-".repeat(60));
    console.log(`  Shop Name:     ${result.shopInfo.name}`);
    console.log(`  Email:         ${result.shopInfo.email}`);
    console.log(`  Domain:        ${result.shopInfo.domain}`);
    console.log(`  Currency:      ${result.shopInfo.currencyCode}`);
    console.log("-".repeat(60));
    console.log();

    // Try to get additional store details
    console.log("Fetching additional store details...");
    try {
      const detailsQuery = `
        query {
          shop {
            name
            email
            myshopifyDomain
            currencyCode
            plan {
              displayName
            }
            features {
              storefront
              dynamicRemarketing
            }
          }
          productsCount: products(first: 0) {
            pageInfo {
              hasNextPage
            }
          }
        }
      `;

      const details = await adminFetch<any>(detailsQuery);
      
      console.log();
      console.log("Additional Details:");
      console.log("-".repeat(60));
      if (details.shop.plan) {
        console.log(`  Plan:          ${details.shop.plan.displayName}`);
      }
      console.log(`  Has Products:  ${details.productsCount ? "Yes" : "Unknown"}`);
      console.log("-".repeat(60));
      console.log();
      
    } catch (error) {
      console.log("ℹ️  Could not fetch additional details (may require additional permissions)");
      console.log();
    }

    console.log("✅ Admin API authentication is working correctly!");
    console.log();
    console.log("You can now use the Admin API to:");
    console.log("  • Create and manage products");
    console.log("  • Create and manage collections");
    console.log("  • Process orders");
    console.log("  • Manage customers");
    console.log("  • Configure store settings");
    console.log("  • And much more!");
    
  } else {
    console.log();
    console.log("❌ Authentication failed!");
    console.error(`Error: ${result.error}`);
    console.log();
    console.log("Troubleshooting:");
    console.log("  1. Verify SHOPIFY_STORE_DOMAIN is correct in .env");
    console.log("  2. Check that CLIENT_ID and CLIENT_SECRET are valid");
    console.log("  3. Ensure your custom app has Admin API access scopes");
    console.log("  4. Verify the app is installed on your store");
    process.exit(1);
  }

  console.log();
  console.log("=".repeat(60));
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
