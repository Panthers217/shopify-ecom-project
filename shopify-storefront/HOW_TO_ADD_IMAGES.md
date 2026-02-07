# How to Add Images to Shopify Products Programmatically

## ✅ Prerequisites
- Admin API authentication is working ✓
- You have the Admin API access scopes configured

## 🎯 Three Ways to Add Images

### 1. Quick Add Images by URL (Recommended)
The easiest way to add images to an existing product:

```bash
npx tsx scripts/quickAddImages.ts product-handle https://example.com/image1.jpg https://example.com/image2.jpg
```

**Example:**
```bash
npx tsx scripts/quickAddImages.ts summer-t-shirt \
  https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png \
  https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png
```

### 2. Add Images Programmatically
Use the main script to manage product images:

```bash
npx tsx scripts/addProductImages.ts
```

This script will:
- List all your products
- Add sample images to products without images
- Create new products with images if none exist

### 3. Upload Local Image Files
Upload images from your computer:

```bash
npx tsx scripts/uploadLocalImages.ts
```

**Note:** Edit the script first to specify:
- `PRODUCT_HANDLE`: Your product's handle
- `IMAGE_FOLDER`: Path to your images folder

---

## 📝 Code Examples

### Add Images to Existing Product

```typescript
import { adminFetch } from "~/lib/shopifyAdmin.server";

async function addImageToProduct(productId: string, imageUrl: string) {
  const mutation = `
    mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
      productCreateMedia(media: $media, productId: $productId) {
        media {
          id
          status
        }
        mediaUserErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    productId: "gid://shopify/Product/1234567890", 
    media: [{
      originalSource: "https://example.com/image.jpg",
      alt: "Product Image",
      mediaContentType: "IMAGE"
    }]
  };

  const result = await adminFetch<any>(mutation, variables);
  return result;
}
```

### Create Product With Images

```typescript
async function createProductWithImages() {
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
      title: "New Product",
      descriptionHtml: "<p>Product description</p>",
      vendor: "Your Store",
      productType: "Apparel"
    },
    media: [
      {
        originalSource: "https://example.com/image1.jpg",
        alt: "Front view",
        mediaContentType: "IMAGE"
      },
      {
        originalSource: "https://example.com/image2.jpg",
        alt: "Back view",
        mediaContentType: "IMAGE"
      }
    ]
  };

  const result = await adminFetch<any>(mutation, variables);
  return result;
}
```

### Update Image Alt Text

```typescript
async function updateImageAltText(productId: string, imageId: string, newAltText: string) {
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
      alt: newAltText
    }]
  };

  const result = await adminFetch<any>(mutation, variables);
  return result;
}
```

---

## 🎨 Image Requirements

### Supported Formats
- JPG/JPEG
- PNG
- GIF
- WEBP
- SVG

### Recommended Specifications
- **Size:** 2048 x 2048 pixels (square)
- **File size:** Under 20 MB
- **Aspect ratio:** 1:1 (square) is recommended
- **Resolution:** 72 DPI minimum

### Best Practices
1. Use high-quality images (at least 1024x1024)
2. Optimize images before uploading (compress without losing quality)
3. Use descriptive alt text for accessibility
4. Order images logically (main product image first)
5. Use consistent image sizes across products

---

## 🔧 Image Sources

### Option 1: External URLs
Use publicly accessible image URLs:
```typescript
{
  originalSource: "https://cdn.example.com/products/shirt-front.jpg",
  alt: "White cotton t-shirt - front view",
  mediaContentType: "IMAGE"
}
```

### Option 2: Upload Local Files
Upload images from your filesystem (see `uploadLocalImages.ts` script):
1. Place images in a folder
2. Configure the script with the folder path
3. Run the script to upload

### Option 3: CDN Images
Use Shopify's CDN or other CDN services:
```
https://cdn.shopify.com/s/files/1/...
```

---

## ⚠️ Common Issues

### Issue: "Access Denied" Error
**Solution:** Your app needs Admin API scopes. Go to your Shopify admin:
1. Settings → Apps and sales channels → Develop apps
2. Configure → Admin API scopes
3. Add these scopes:
   - `read_products`
   - `write_products`
4. Save and reinstall the app

### Issue: "Invalid Image URL"
**Solution:** 
- Ensure the URL is publicly accessible
- Check that the image format is supported
- Verify the URL doesn't require authentication

### Issue: "Product Not Found"
**Solution:**
- Use the product's **handle** (URL slug), not the title
- Check product exists in your store
- Verify you have permission to access the product

### Issue: Image Upload Fails
**Solution:**
- Check file size (must be under 20MB)
- Verify file format is supported
- Ensure stable internet connection
- Check Shopify API rate limits

---

## 📊 Bulk Image Operations

### Add Images to Multiple Products

```typescript
async function bulkAddImages(products: Array<{id: string, imageUrl: string}>) {
  for (const product of products) {
    await addImageToProduct(product.id, product.imageUrl);
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
```

### Add Multiple Images to One Product

```typescript
const imageUrls = [
  "https://example.com/image1.jpg",
  "https://example.com/image2.jpg",
  "https://example.com/image3.jpg",
  "https://example.com/image4.jpg"
];

await addProductImagesByUrl({
  productId: "gid://shopify/Product/1234567890",
  images: imageUrls.map((url, index) => ({
    url,
    altText: `Product Image ${index + 1}`,
    position: index + 1
  }))
});
```

---

## 🚀 Quick Start

1. **Find a product handle:**
   ```bash
   # Visit your product in Shopify admin
   # The handle is in the URL: /admin/products/[HANDLE]
   ```

2. **Add images:**
   ```bash
   npx tsx scripts/quickAddImages.ts YOUR-PRODUCT-HANDLE https://your-image-url.jpg
   ```

3. **Verify:**
   - Check the product in your Shopify admin
   - Images should appear in the product media gallery

---

## 📚 Additional Resources

- [Shopify Admin API - Product Media](https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreateMedia)
- [Image Best Practices](https://help.shopify.com/en/manual/products/product-media/product-images)
- [GraphQL Admin API Reference](https://shopify.dev/docs/api/admin-graphql)

---

## 💡 Pro Tips

1. **Batch Operations:** When adding images to many products, add delays between requests to avoid rate limits
2. **Image Optimization:** Compress images before uploading to improve page load times
3. **Alt Text:** Always include descriptive alt text for SEO and accessibility
4. **Image Order:** The first image is used as the product thumbnail
5. **Testing:** Test with a few products first before bulk operations

---

Need help? Check the scripts in `/scripts/` folder for complete working examples!
