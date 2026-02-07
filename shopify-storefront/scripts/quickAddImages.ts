/**
 * Quick Add Images Helper
 * 
 * Simple script to quickly add images to a product
 * Run with: npx tsx scripts/quickAddImages.ts <product-handle> <image-url-1> [image-url-2] ...
 * 
 * Examples:
 *   npx tsx scripts/quickAddImages.ts my-product-handle https://example.com/image1.jpg
 *   npx tsx scripts/quickAddImages.ts my-product-handle https://example.com/img1.jpg https://example.com/img2.jpg
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { adminFetch } = await import("../app/lib/shopifyAdmin.server");

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: npx tsx scripts/quickAddImages.ts <product-handle> <image-url-1> [image-url-2] ...");
  console.log("\nExample:");
  console.log("  npx tsx scripts/quickAddImages.ts t-shirt https://example.com/front.jpg https://example.com/back.jpg");
  process.exit(1);
}

const productHandle = args[0];
const imageUrls = args.slice(1);

async function quickAddImages() {
  console.log(`\n🔍 Looking for product: ${productHandle}`);
  
  // Get product by handle
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        images(first: 10) {
          edges {
            node {
              id
              url
            }
          }
        }
      }
    }
  `;

  const result = await adminFetch<any>(query, { handle: productHandle });
  
  if (!result.productByHandle) {
    console.error(`❌ Product not found: ${productHandle}`);
    console.log("\n💡 Tip: Use the product's handle (URL slug), not the title");
    process.exit(1);
  }

  const product = result.productByHandle;
  console.log(`✅ Found: ${product.title}`);
  console.log(`   Current images: ${product.images.edges.length}`);
  console.log(`\n📸 Adding ${imageUrls.length} new image(s)...`);

  // Add images
  const mutation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          ... on MediaImage {
            id
            image {
              url
            }
            status
          }
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    productId: product.id,
    media: imageUrls.map((url, index) => ({
      originalSource: url,
      alt: `${product.title} - Image ${product.images.edges.length + index + 1}`,
      mediaContentType: "IMAGE"
    }))
  };

  const addResult = await adminFetch<any>(mutation, variables);

  if (addResult.productCreateMedia.mediaUserErrors.length > 0) {
    console.error("\n❌ Errors:");
    addResult.productCreateMedia.mediaUserErrors.forEach((error: any) => {
      console.error(`   - ${error.field}: ${error.message}`);
    });
    process.exit(1);
  }

  console.log("\n✅ Success! Images added:");
  imageUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });
  
  console.log(`\n🔗 View product: https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/products/${product.id.split('/').pop()}`);
}

quickAddImages().catch((error) => {
  console.error("\n❌ Error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
