/**
 * Diagnostic script for variant inventory and availability
 * Run with: npx tsx scripts/diagnoseVariantInventory.ts
 */

import dotenv from "dotenv";
dotenv.config();

const STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

if (!STOREFRONT_ACCESS_TOKEN || !SHOP_DOMAIN) {
  console.error("❌ Missing environment variables");
  process.exit(1);
}

const VARIANT_QUERY = `
  query getVariant($id: ID!) {
    node(id: $id) {
      ... on ProductVariant {
        id
        title
        availableForSale
        quantityAvailable
        currentlyNotInStock
        requiresShipping
        priceV2 {
          amount
          currencyCode
        }
        product {
          id
          title
          handle
        }
      }
    }
  }
`;

async function diagnoseVariant(variantId: string) {
  console.log("🔍 Diagnosing variant inventory...\n");
  console.log("Variant ID:", variantId);
  console.log("Shop Domain:", SHOP_DOMAIN);
  console.log("=" .repeat(80));

  const variantGid = `gid://shopify/ProductVariant/${variantId}`;

  try {
    const response = await fetch(`https://${SHOP_DOMAIN}/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({
        query: VARIANT_QUERY,
        variables: { id: variantGid },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error("❌ GraphQL Errors:", JSON.stringify(result.errors, null, 2));
      return;
    }

    const variant = result.data.node;

    if (!variant) {
      console.error("❌ Variant not found");
      return;
    }

    console.log("\n✅ VARIANT DETAILS:");
    console.log("-".repeat(80));
    console.log("Title:", variant.title);
    console.log("Product:", variant.product.title);
    console.log("Product Handle:", variant.product.handle);
    console.log("\n💰 PRICING:");
    console.log("-".repeat(80));
    console.log("Price:", variant.priceV2.amount, variant.priceV2.currencyCode);
    console.log("\n📦 INVENTORY & AVAILABILITY:");
    console.log("-".repeat(80));
    console.log("Available for Sale:", variant.availableForSale);
    console.log("Quantity Available:", variant.quantityAvailable);
    console.log("Currently Not In Stock:", variant.currentlyNotInStock);
    console.log("Requires Shipping:", variant.requiresShipping);

    // Check for issues
    console.log("\n🔍 DIAGNOSIS:");
    console.log("-".repeat(80));

    if (!variant.availableForSale) {
      console.log("❌ ISSUE: Variant is NOT available for sale");
      console.log("   → Check product status and variant settings in Shopify Admin");
    } else {
      console.log("✅ Variant is available for sale");
    }

    if (variant.quantityAvailable === 0) {
      console.log("❌ ISSUE: Quantity available is 0");
      console.log("   → Inventory is tracked and there's no stock");
      console.log("   → Go to Shopify Admin → Products → Inventory");
      console.log("   → Either add inventory or turn off inventory tracking");
    } else if (variant.quantityAvailable > 0) {
      console.log(`✅ Quantity available: ${variant.quantityAvailable}`);
    } else {
      console.log("⚠️  Quantity not tracked (null/undefined)");
    }

    if (variant.currentlyNotInStock) {
      console.log("❌ ISSUE: Marked as currently not in stock");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// The problematic variant from the logs
const VARIANT_ID = "47968052871323";
diagnoseVariant(VARIANT_ID);
