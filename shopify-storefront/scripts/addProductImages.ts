/**
 * Add Images to Shopify Products
 * 
 * This script demonstrates how to add images to products using the Shopify Admin API.
 * You can add images via URL or upload local files.
 * 
 * Run with: npx tsx scripts/addProductImages.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { adminFetch } = await import("../app/lib/shopifyAdmin.server");

// ============================================================================
// CONFIGURATION
// ============================================================================

interface ProductImageInput {
  productId: string;  // Product GID (e.g., "gid://shopify/Product/1234567890")
  images: Array<{
    url?: string;       // URL of the image to attach
    altText?: string;   // Alt text for accessibility
    position?: number;  // Order position (1 = first image)
  }>;
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

/**
 * Add images to a product via URLs
 */
async function addProductImagesByUrl(input: ProductImageInput): Promise<void> {
  console.log(`\n📸 Adding ${input.images.length} image(s) to product...`);
  
  for (const [index, image] of input.images.entries()) {
    if (!image.url) {
      console.log(`⚠️  Skipping image ${index + 1}: No URL provided`);
      continue;
    }

    const mutation = `
      mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
        productCreateMedia(media: $media, productId: $productId) {
          media {
            ... on MediaImage {
              id
              image {
                url
                altText
              }
              status
            }
          }
          mediaUserErrors {
            field
            message
          }
          product {
            id
            title
          }
        }
      }
    `;

    const variables = {
      productId: input.productId,
      media: [{
        originalSource: image.url,
        alt: image.altText || "",
        mediaContentType: "IMAGE"
      }]
    };

    try {
      const result = await adminFetch<any>(mutation, variables);
      
      if (result.productCreateMedia.mediaUserErrors.length > 0) {
        console.error(`❌ Error adding image ${index + 1}:`, result.productCreateMedia.mediaUserErrors);
      } else {
        console.log(`✅ Image ${index + 1} added successfully`);
        console.log(`   URL: ${image.url}`);
        if (image.altText) console.log(`   Alt text: ${image.altText}`);
      }
    } catch (error) {
      console.error(`❌ Failed to add image ${index + 1}:`, error instanceof Error ? error.message : error);
    }
  }
}

/**
 * Get all products in the store
 */
async function getAllProducts(): Promise<Array<{ id: string; title: string; handle: string; imageCount: number }>> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            images(first: 10) {
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await adminFetch<any>(query, { first: 50 });
    return result.products.edges.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      imageCount: edge.node.images.edges.length
    }));
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    return [];
  }
}

/**
 * Get product by handle
 */
async function getProductByHandle(handle: string): Promise<{ id: string; title: string } | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
      }
    }
  `;

  try {
    const result = await adminFetch<any>(query, { handle });
    return result.productByHandle;
  } catch (error) {
    console.error(`❌ Failed to fetch product with handle "${handle}":`, error);
    return null;
  }
}

/**
 * Update image alt text and position
 */
async function updateProductImage(productId: string, imageId: string, altText?: string): Promise<void> {
  const mutation = `
    mutation updateProductImage($productId: ID!, $media: [UpdateMediaInput!]!) {
      productUpdateMedia(productId: $productId, media: $media) {
        media {
          ... on MediaImage {
            id
            alt
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
    media: [{
      id: imageId,
      alt: altText || ""
    }]
  };

  try {
    const result = await adminFetch<any>(mutation, variables);
    if (result.productUpdateMedia.mediaUserErrors.length > 0) {
      console.error("❌ Error updating image:", result.productUpdateMedia.mediaUserErrors);
    } else {
      console.log("✅ Image updated successfully");
    }
  } catch (error) {
    console.error("❌ Failed to update image:", error);
  }
}

/**
 * Create a new product with images
 */
async function createProductWithImages(productData: {
  title: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  imageUrls: string[];
}): Promise<string | null> {
  console.log(`\n🆕 Creating product: ${productData.title}`);

  const mutation = `
    mutation createProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          title
          handle
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title: productData.title,
      descriptionHtml: productData.descriptionHtml,
      vendor: productData.vendor,
      productType: productData.productType,
    },
    media: productData.imageUrls.map((url, index) => ({
      originalSource: url,
      alt: `${productData.title} - Image ${index + 1}`,
      mediaContentType: "IMAGE"
    }))
  };

  try {
    const result = await adminFetch<any>(mutation, variables);
    
    if (result.productCreate.userErrors.length > 0) {
      console.error("❌ Error creating product:", result.productCreate.userErrors);
      return null;
    }
    
    console.log(`✅ Product created successfully!`);
    console.log(`   ID: ${result.productCreate.product.id}`);
    console.log(`   Handle: ${result.productCreate.product.handle}`);
    console.log(`   Images: ${productData.imageUrls.length}`);
    
    return result.productCreate.product.id;
  } catch (error) {
    console.error("❌ Failed to create product:", error instanceof Error ? error.message : error);
    return null;
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

async function main() {
  console.log("=".repeat(70));
  console.log("🖼️  Shopify Product Image Management");
  console.log("=".repeat(70));

  // Example 1: List all products
  console.log("\n📋 Fetching all products...");
  const products = await getAllProducts();
  
  if (products.length === 0) {
    console.log("⚠️  No products found. Let's create one with images!");
    
    // Example 2: Create a new product with images
    const sampleProduct = {
      title: "Sample T-Shirt with Images",
      descriptionHtml: "<p>A high-quality cotton t-shirt</p>",
      vendor: "Your Store",
      productType: "Apparel",
      imageUrls: [
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
        "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_small.png"
      ]
    };
    
    await createProductWithImages(sampleProduct);
  } else {
    console.log(`\n✅ Found ${products.length} product(s):\n`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Handle: ${product.handle}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Images: ${product.imageCount}`);
      console.log();
    });

    // Example 3: Add images to an existing product
    if (products.length > 0 && products[0].imageCount === 0) {
      console.log(`\n📸 Adding images to: ${products[0].title}`);
      await addProductImagesByUrl({
        productId: products[0].id,
        images: [
          {
            url: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png",
            altText: `${products[0].title} - Main Image`,
            position: 1
          },
          {
            url: "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png",
            altText: `${products[0].title} - Second Image`,
            position: 2
          }
        ]
      });
    }
  }

  console.log("\n" + "=".repeat(70));
  console.log("✅ Done!");
  console.log("=".repeat(70));
}

// ============================================================================
// CUSTOM USAGE EXAMPLES (commented out)
// ============================================================================

/*
// Example: Add images to a specific product by handle
async function addImagesToSpecificProduct() {
  const product = await getProductByHandle("your-product-handle");
  
  if (product) {
    await addProductImagesByUrl({
      productId: product.id,
      images: [
        { url: "https://example.com/image1.jpg", altText: "Front view" },
        { url: "https://example.com/image2.jpg", altText: "Back view" },
        { url: "https://example.com/image3.jpg", altText: "Side view" }
      ]
    });
  }
}

// Example: Create multiple products with images from a CSV
async function bulkCreateProductsWithImages() {
  const products = [
    {
      title: "Product 1",
      descriptionHtml: "<p>Description</p>",
      vendor: "Brand",
      productType: "Type",
      imageUrls: ["https://example.com/image1.jpg"]
    },
    // ... more products
  ];

  for (const product of products) {
    await createProductWithImages(product);
  }
}
*/

// ============================================================================
// RUN
// ============================================================================

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
