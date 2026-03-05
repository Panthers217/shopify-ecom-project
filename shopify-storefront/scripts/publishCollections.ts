/**
 * Publish Collections to Online Store
 * Makes collections visible via the Storefront API
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
const { adminFetch } = await import("../app/lib/shopifyAdmin.server.js");

const GET_PUBLICATIONS_QUERY = `
  query {
    publications(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const PUBLISH_COLLECTION_MUTATION = `
  mutation publishCollection($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      publishable {
        ... on Collection {
          id
          title
          handle
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const GET_COLLECTIONS_TO_PUBLISH = `
  query {
    collections(first: 50) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`;

async function publishCollections() {
  console.log("🔍 Publishing Collections to Online Store...\n");
  
  try {
    // Step 1: Get the Online Store publication ID
    console.log("Step 1: Finding Online Store publication...\n");
    const publicationsData: any = await adminFetch(GET_PUBLICATIONS_QUERY, {});
    
    const publications = publicationsData.publications.edges;
    console.log("Available publications:");
    publications.forEach(({ node }: any) => {
      console.log(`  - ${node.name} (${node.id})`);
    });
    
    const onlineStore = publications.find(({ node }: any) => 
      node.name === "Online Store" || node.name.toLowerCase().includes("online")
    );
    
    if (!onlineStore) {
      console.error("\n❌ Could not find Online Store publication!");
      return;
    }
    
    const publicationId = onlineStore.node.id;
    console.log(`\n✅ Using publication: ${onlineStore.node.name} (${publicationId})\n`);
    
    // Step 2: Get all collections
    console.log("Step 2: Getting collections...\n");
    const collectionsData: any = await adminFetch(GET_COLLECTIONS_TO_PUBLISH, {});
    const collections = collectionsData.collections.edges;
    
    console.log(`Found ${collections.length} collections\n`);
    
    // Step 3: Publish each collection
    console.log("Step 3: Publishing collections...\n");
    
    const targetCollections = ["accessories", "jewelry", "shoes", "women", "men", "kids", "sale", "bestseller"];
    
    for (const { node } of collections) {
      if (targetCollections.includes(node.handle)) {
        try {
          console.log(`Publishing: ${node.title} (${node.handle})...`);
          
          const response: any = await adminFetch(PUBLISH_COLLECTION_MUTATION, {
            id: node.id,
            input: [
              {
                publicationId: publicationId,
              }
            ]
          });
          
          if (response.publishablePublish.userErrors.length > 0) {
            console.error(`  ❌ Errors:`, response.publishablePublish.userErrors.map((e: any) => e.message).join(", "));
          } else {
            console.log(`  ✅ Published successfully`);
          }
          
          // Small delay between publications
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.error(`  ❌ Error:`, error);
        }
      }
    }
    
    console.log("\n✅ Publishing complete!");
    console.log("\nRun 'npx tsx scripts/checkStorefrontAccess.ts' to verify.");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

publishCollections();
