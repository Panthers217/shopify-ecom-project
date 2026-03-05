/**
 * Check Storefront API Access - Diagnostic Script
 * Verify what collections and products the Storefront API can access
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

// Use dynamic import
const { storefrontFetch } = await import("../app/lib/shopifyStorefront.server.js");

async function checkStorefrontAccess() {
  console.log("🔍 Checking Storefront API Access...\n");
  
  // Check collections
  try {
    console.log("=== COLLECTIONS ===\n");
    const collectionsData: any = await storefrontFetch(`
      query {
        collections(first: 20) {
          edges {
            node {
              id
              title
              handle
            }
          }
        }
      }
    `, {});

    const collections = collectionsData.collections.edges;
    console.log(`Found ${collections.length} collections via Storefront API:\n`);
    
    collections.forEach(({ node }: any, index: number) => {
      console.log(`${index + 1}. ${node.title} (${node.handle})`);
    });
    
  } catch (error) {
    console.error("❌ Error fetching collections:", error);
  }
  
  // Check specific collections
  console.log("\n\n=== CHECKING SPECIFIC COLLECTIONS ===\n");
  
  const testCollections = ["apparel", "accessories", "jewelry", "shoes", "women", "men", "kids", "sale", "bestseller"];
  
  for (const handle of testCollections) {
    try {
      const data: any = await storefrontFetch(`
        query {
          collection(handle: "${handle}") {
            id
            title
            handle
            products(first: 5) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
          }
        }
      `, {});
      
      if (data.collection) {
        const productCount = data.collection.products.edges.length;
        console.log(`✅ ${data.collection.title} (${handle})`);
        console.log(`   Products visible: ${productCount}`);
        if (productCount > 0) {
          console.log(`   Sample products:`);
          data.collection.products.edges.forEach(({ node }: any) => {
            console.log(`     - ${node.title}`);
          });
        }
      } else {
        console.log(`❌ ${handle} - NOT FOUND via Storefront API`);
      }
      console.log('');
      
    } catch (error) {
      console.error(`❌ ${handle} - Error:`, error);
    }
  }
}

checkStorefrontAccess();
