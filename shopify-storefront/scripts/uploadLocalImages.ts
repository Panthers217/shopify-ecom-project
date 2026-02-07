/**
 * Upload Local Images to Shopify Products
 * 
 * This script uploads images from your local filesystem to Shopify products
 * Images are first uploaded to Shopify's servers, then attached to the product
 * 
 * Run with: npx tsx scripts/uploadLocalImages.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { adminFetch } = await import("../app/lib/shopifyAdmin.server");

/**
 * Generate a staged upload URL for the image
 */
async function generateStagedUploadUrl(filename: string, mimeType: string, fileSize: number) {
  const mutation = `
    mutation generateStagedUpload($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: [{
      filename,
      mimeType,
      resource: "IMAGE",
      fileSize: fileSize.toString()
    }]
  };

  const result = await adminFetch<any>(mutation, variables);

  if (result.stagedUploadsCreate.userErrors.length > 0) {
    throw new Error(`Staged upload error: ${JSON.stringify(result.stagedUploadsCreate.userErrors)}`);
  }

  return result.stagedUploadsCreate.stagedTargets[0];
}

/**
 * Upload file to Shopify's staged upload URL
 */
async function uploadFileToStaging(filePath: string, stagedTarget: any): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const formData = new FormData();

  // Add parameters from staged target
  for (const param of stagedTarget.parameters) {
    formData.append(param.name, param.value);
  }

  // Add the file
  const blob = new Blob([fileBuffer], { type: getMimeType(filePath) });
  formData.append('file', blob, path.basename(filePath));

  const response = await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return stagedTarget.resourceUrl;
}

/**
 * Get MIME type from file extension
 */
function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Add local image files to a product
 */
async function addLocalImagesToProduct(productId: string, imagePaths: string[]) {
  console.log(`\n📤 Uploading ${imagePaths.length} image(s)...`);

  const uploadedUrls: string[] = [];

  for (const [index, imagePath] of imagePaths.entries()) {
    console.log(`\n[${index + 1}/${imagePaths.length}] Processing: ${path.basename(imagePath)}`);
    
    if (!fs.existsSync(imagePath)) {
      console.error(`   ❌ File not found: ${imagePath}`);
      continue;
    }

    const fileStats = fs.statSync(imagePath);
    const filename = path.basename(imagePath);
    const mimeType = getMimeType(imagePath);

    console.log(`   📊 Size: ${(fileStats.size / 1024).toFixed(2)} KB`);
    console.log(`   📄 Type: ${mimeType}`);

    try {
      // Step 1: Generate staged upload URL
      console.log(`   🔗 Generating upload URL...`);
      const stagedTarget = await generateStagedUploadUrl(filename, mimeType, fileStats.size);

      // Step 2: Upload file
      console.log(`   ⬆️  Uploading file...`);
      const resourceUrl = await uploadFileToStaging(imagePath, stagedTarget);
      uploadedUrls.push(resourceUrl);
      
      console.log(`   ✅ Uploaded successfully`);
    } catch (error) {
      console.error(`   ❌ Upload failed:`, error instanceof Error ? error.message : error);
    }
  }

  if (uploadedUrls.length === 0) {
    console.log("\n❌ No images were uploaded successfully");
    return;
  }

  // Step 3: Attach uploaded images to product
  console.log(`\n🔗 Attaching ${uploadedUrls.length} image(s) to product...`);

  const mutation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          ... on MediaImage {
            id
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
    productId,
    media: uploadedUrls.map((url, index) => ({
      originalSource: url,
      alt: `Product Image ${index + 1}`,
      mediaContentType: "IMAGE"
    }))
  };

  const result = await adminFetch<any>(mutation, variables);

  if (result.productCreateMedia.mediaUserErrors.length > 0) {
    console.error("\n❌ Error attaching images:", result.productCreateMedia.mediaUserErrors);
  } else {
    console.log(`\n✅ All images attached successfully!`);
  }
}

/**
 * Get product by handle
 */
async function getProductByHandle(handle: string) {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
      }
    }
  `;

  const result = await adminFetch<any>(query, { handle });
  return result.productByHandle;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log("=".repeat(70));
  console.log("📤 Upload Local Images to Shopify Product");
  console.log("=".repeat(70));

  // Configuration - EDIT THESE VALUES
  const PRODUCT_HANDLE = "your-product-handle";  // Change this!
  const IMAGE_FOLDER = path.resolve(__dirname, "../public/images"); // Change this!
  
  // Example: Upload all images from a folder
  const imageFiles = [
    path.join(IMAGE_FOLDER, "image1.jpg"),
    path.join(IMAGE_FOLDER, "image2.jpg"),
    path.join(IMAGE_FOLDER, "image3.jpg"),
  ];

  console.log(`\n🔍 Looking for product: ${PRODUCT_HANDLE}`);
  const product = await getProductByHandle(PRODUCT_HANDLE);

  if (!product) {
    console.error(`\n❌ Product not found: ${PRODUCT_HANDLE}`);
    console.log("\n💡 Edit this script and change PRODUCT_HANDLE to your product's handle");
    process.exit(1);
  }

  console.log(`✅ Found: ${product.title}`);
  
  await addLocalImagesToProduct(product.id, imageFiles);

  console.log("\n" + "=".repeat(70));
  console.log("✅ Done!");
  console.log("=".repeat(70));
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
