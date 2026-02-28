/**
 * Diagnostic script for Denim Jacket product
 * Helps identify why Color option isn't showing with variants
 * Run with: npx tsx -r dotenv/config scripts/diagnoseDenimJacket.ts
 */

import dotenv from "dotenv";
dotenv.config();

import { storefrontFetch } from "../app/lib/shopifyStorefront.server";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "../app/lib/queries";
import { mapProduct } from "../app/lib/productMapper";

async function diagnose() {
  console.log("🔍 Diagnosing Denim Jacket product...\n");

  try {
    const productData = await storefrontFetch<{ product: any }>(
      GET_PRODUCT_BY_HANDLE_QUERY,
      { handle: "denim-jacket" }
    );

    const rawProduct = productData.product;

    if (!rawProduct) {
      console.log("❌ Denim Jacket product not found");
      return;
    }

    console.log("=".repeat(80));
    console.log("DETAILED DIAGNOSTIC REPORT");
    console.log("=".repeat(80));

    // 1. Check Options Configuration
    console.log("\n1️⃣  PRODUCT OPTIONS CONFIGURATION");
    console.log("-".repeat(80));
    
    if (!rawProduct.options || rawProduct.options.length === 0) {
      console.log("❌ No options found in the product");
    } else {
      console.log(`✅ Found ${rawProduct.options.length} option(s):\n`);
      rawProduct.options.forEach((opt: any, idx: number) => {
        console.log(`   Option ${idx + 1}: "${opt.name}"`);
        console.log(`   └─ Values: ${opt.values.join(", ")}`);
        console.log(`   └─ ID: ${opt.id}\n`);
      });
    }

    // 2. Check for Color option specifically
    console.log("2️⃣  LOOKING FOR COLOR OPTION");
    console.log("-".repeat(80));
    
    const hasColorOption = rawProduct.options?.some((opt: any) => 
      opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour"
    );

    if (!hasColorOption) {
      console.log("❌ NO COLOR OPTION FOUND\n");
      console.log("   Possible causes:");
      console.log("   1. Color option not added to the product in Shopify");
      console.log("   2. Color option added but no variants use it");
      console.log("   3. Color variants not published to Storefront\n");
    } else {
      console.log("✅ Color option is configured\n");
    }

    // 3. Analyze Variants
    console.log("3️⃣  VARIANT ANALYSIS");
    console.log("-".repeat(80));
    
    const variants = rawProduct.variants.edges.map((edge: any) => edge.node);
    console.log(`Total variants: ${variants.length}\n`);

    // Group by selected options to show structure
    const variantDetails = variants.map((v: any, idx: number) => ({
      index: idx + 1,
      title: v.title,
      available: v.availableForSale,
      price: v.price.amount,
      options: v.selectedOptions.map((so: any) => ({ name: so.name, value: so.value }))
    }));

    // Show variant matrix
    console.log("   Variant Details:");
    variantDetails.forEach((v) => {
      console.log(`\n   Variant ${v.index}: "${v.title}"`);
      console.log(`   ├─ Available: ${v.available ? '✅' : '❌'}`);
      console.log(`   ├─ Price: $${v.price}`);
      console.log(`   └─ Selected Options:`);
      v.options.forEach((opt) => {
        console.log(`      • ${opt.name}: ${opt.value}`);
      });
    });

    // 4. Check for distinct option combinations
    console.log("\n4️⃣  OPTION COMBINATIONS FOUND");
    console.log("-".repeat(80));
    
    const optionCombinations = variantDetails.map(v => 
      v.options.map(o => `${o.name}:${o.value}`).join(" | ")
    );
    
    const uniqueCombinations = [...new Set(optionCombinations)];
    console.log(`\nVariant combinations: ${uniqueCombinations.length}`);
    uniqueCombinations.forEach((combo, idx) => {
      console.log(`   ${idx + 1}. ${combo}`);
    });

    // 5. Recommendations
    console.log("\n" + "=".repeat(80));
    console.log("💡 RECOMMENDATIONS");
    console.log("=".repeat(80) + "\n");

    if (hasColorOption) {
      console.log("✅ Color option exists but you need to:");
      console.log("   1. Go to Shopify Admin → Products → Denim Jacket");
      console.log("   2. Click 'Variants' to see all variants");
      console.log("   3. You should see a matrix of Size × Color combinations");
      console.log("   4. If you don't see color variants:");
      console.log("      → Click 'Edit variants'");
      console.log("      → Create combinations for each Size+Color pair");
      console.log("   5. Ensure all variants are checked as 'Available' if you want them shown");
      console.log("   6. Make sure variants are published to the 'Online Store' sales channel\n");
    } else {
      console.log("❌ Color option is missing. To add it:");
      console.log("   1. Go to Shopify Admin → Products → Denim Jacket");
      console.log("   2. Scroll to 'Options' section");
      console.log("   3. Add a new option called 'Color'");
      console.log("   4. Add color values (e.g., Light Blue, Black, etc.)");
      console.log("   5. Create variants for each Size + Color combination");
      console.log("   6. Ensure all variants are published\n");
    }

    // 6. API Info
    console.log("ℹ️  API INFORMATION");
    console.log("-".repeat(80));
    console.log(`Store: ${process.env.SHOPIFY_STORE_DOMAIN}`);
    console.log(`API Version: 2024-10`);
    console.log(`Product Handle: denim-jacket`);
    console.log(`Total Options Fetched: ${rawProduct.options?.length || 0}`);
    console.log(`Total Variants Fetched: ${variants.length}\n`);

  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Details:", error.message);
    }
  }
}

diagnose();
