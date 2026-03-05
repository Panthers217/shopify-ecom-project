/**
 * Check Product Publications - Diagnostic Script
 * Verifies which products are published to which sales channels
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables BEFORE importing modules that use them
const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

// Use dynamic import to load adminFetch AFTER environment variables are set
const { adminFetch } = await import("../app/lib/shopifyAdmin.server.js");

const CHECK_PRODUCT_PUBLICATIONS = `
  query checkProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          status
          publishedOnCurrentPublication
          collections(first: 10) {
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
    }
  }
`;

async function checkPublications() {
  console.log("🔍 Checking Product Publications...\n");
  
  try {
    const response: any = await adminFetch(CHECK_PRODUCT_PUBLICATIONS, {
      first: 20,
    });

    const products = response.products.edges;
    
    console.log(`Found ${products.length} products:\n`);
    
    products.forEach(({ node }: any, index: number) => {
      console.log(`${index + 1}. ${node.title} (${node.handle})`);
      console.log(`   Status: ${node.status}`);
      console.log(`   Published on Current: ${node.publishedOnCurrentPublication}`);
      console.log(`   Collections: ${node.collections.edges.map((c: any) => c.node.title).join(", ") || "None"}`);
      console.log('');
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkPublications();
