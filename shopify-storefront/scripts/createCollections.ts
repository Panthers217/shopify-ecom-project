/**
 * Script to create collections in Shopify using Admin API
 * Run with: npx tsx scripts/createCollections.ts
 */

import { config } from "dotenv";

// Load .env file from parent directory
config({ path: ".env" });

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "rouse-commerce-lab.myshopify.com";
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

const ADMIN_API_VERSION = "2024-01";

interface Collection {
  title: string;
  handle: string;
  description: string;
}

const collections: Collection[] = [
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

async function getAccessToken(): Promise<string> {
  if (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET) {
    throw new Error("Missing SHOPIFY_CLIENT_ID or SHOPIFY_CLIENT_SECRET");
  }

  const tokenUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`;
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function createCollection(accessToken: string, collection: Collection) {
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/custom_collections.json`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      custom_collection: {
        title: collection.title,
        handle: collection.handle,
        body_html: collection.description,
        published: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create collection ${collection.handle}: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.custom_collection;
}

async function main() {
  console.log("🚀 Creating collections in Shopify...\n");

  try {
    // Get access token
    console.log("🔑 Getting access token...");
    const accessToken = await getAccessToken();
    console.log("✅ Access token obtained\n");

    // Create each collection
    for (const collection of collections) {
      try {
        console.log(`📦 Creating collection: ${collection.title} (${collection.handle})...`);
        const created = await createCollection(accessToken, collection);
        console.log(`✅ Created: ${created.title} - ID: ${created.id}\n`);
      } catch (error) {
        console.error(`❌ Error creating ${collection.handle}:`, error);
        // Continue with next collection
      }
    }

    console.log("\n✨ Collection creation complete!");
    console.log("\n📋 Next steps:");
    console.log("1. Run: npx tsx scripts/uploadProducts.ts");
    console.log("2. Or import products.csv in Shopify Admin > Products > Import");

  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

main();
