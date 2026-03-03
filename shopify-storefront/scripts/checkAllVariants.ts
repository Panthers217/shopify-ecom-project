/**
 * Check all variants for Denim Jacket to find ones with inventory
 * Run with: npx tsx scripts/checkAllVariants.ts
 */

import dotenv from "dotenv";
dotenv.config();

const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            priceV2 {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

async function checkVariants() {
  console.log("🔍 Checking all Denim Jacket variants...\n");

  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: PRODUCT_QUERY,
        variables: { handle: "denim-jacket" },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("❌ Errors:", result.errors);
      return;
    }

    const product = result.data.product;
    console.log("Product:", product.title);
    console.log("=" .repeat(80));

    const variants = product.variants.edges.map((edge: any) => edge.node);

    console.log(`\n📦 Found ${variants.length} variants:\n`);

    variants.forEach((variant: any, index: number) => {
      const available = variant.availableForSale ? "✅" : "❌";
      const stock = variant.quantityAvailable;
      const variantId = variant.id.split('/').pop();
      
      console.log(`${index + 1}. ${variant.title}`);
      console.log(`   ID: ${variantId}`);
      console.log(`   Available: ${available} ${variant.availableForSale ? "YES" : "NO"}`);
      console.log(`   Stock: ${stock === null ? "Not tracked" : stock}`);
      console.log(`   Price: $${variant.priceV2.amount}`);
      console.log();
    });

    // Summary
    const availableVariants = variants.filter((v: any) => v.availableForSale);
    const withStock = variants.filter((v: any) => v.quantityAvailable > 0);

    console.log("=" .repeat(80));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   Total variants: ${variants.length}`);
    console.log(`   Available for sale: ${availableVariants.length}`);
    console.log(`   With stock: ${withStock.length}`);

    if (withStock.length > 0) {
      console.log(`\n✅ You can use these variants with stock:`);
      withStock.forEach((v: any) => {
        const variantId = v.id.split('/').pop();
        console.log(`   - ${v.title} (ID: ${variantId}) - Qty: ${v.quantityAvailable}`);
      });
    } else {
      console.log(`\n❌ No variants have inventory!`);
      console.log(`   Action needed: Add inventory in Shopify Admin or disable tracking`);
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

checkVariants();
