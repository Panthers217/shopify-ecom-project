/**
 * Test script to fetch and inspect the Denim Jacket product
 * Run with: npx tsx -r dotenv/config scripts/testProductData.ts
 */

// IMPORTANT: Load dotenv FIRST before any other imports
import dotenv from "dotenv";
dotenv.config();

// Now import the Shopify modules after env is loaded
import { storefrontFetch } from "../app/lib/shopifyStorefront.server";
import { GET_PRODUCTS_QUERY, GET_PRODUCT_BY_HANDLE_QUERY } from "../app/lib/queries";
import { mapProduct } from "../app/lib/productMapper";

async function testDenimJacket() {
  console.log("🔍 Fetching products from Shopify...\n");

  try {
    // First, get all products to find Denim Jacket
    const productsData = await storefrontFetch<{ products: any }>(GET_PRODUCTS_QUERY, {
      first: 50,
    });

    const products = productsData.products.edges;
    
    if (products.length === 0) {
      console.log("❌ No products found in your Shopify store.");
      return;
    }

    console.log(`✅ Found ${products.length} products\n`);

    // Find the Denim Jacket product
    const denimJacketProduct = products.find(
      (edge: any) => edge.node.title.toLowerCase().includes("denim jacket")
    );

    if (!denimJacketProduct) {
      console.log("❌ Denim Jacket product not found");
      console.log("Available products:");
      products.forEach((edge: any, index: number) => {
        console.log(`  ${index + 1}. ${edge.node.title} (handle: ${edge.node.handle})`);
      });
      return;
    }

    const productHandle = denimJacketProduct.node.handle;
    console.log(`✅ Found Denim Jacket! Fetching detailed data...\n`);

    // Fetch full product details
    const productData = await storefrontFetch<{ product: any }>(
      GET_PRODUCT_BY_HANDLE_QUERY,
      { handle: productHandle }
    );

    const rawProduct = productData.product;

    console.log("=".repeat(80));
    console.log("RAW SHOPIFY PRODUCT DATA");
    console.log("=".repeat(80));
    
    console.log("\n📋 Basic Info:");
    console.log(`  Title: ${rawProduct.title}`);
    console.log(`  Vendor: ${rawProduct.vendor}`);
    console.log(`  Type: ${rawProduct.productType}`);
    console.log(`  Available: ${rawProduct.availableForSale}`);

    console.log("\n🎨 OPTIONS:");
    if (rawProduct.options && rawProduct.options.length > 0) {
      rawProduct.options.forEach((opt: any) => {
        console.log(`  ${opt.name} (position ${opt.id}):`);
        console.log(`    Values: ${opt.values.join(", ")}`);
      });
    } else {
      console.log("  ❌ No options found");
    }

    console.log("\n📦 VARIANTS:");
    if (rawProduct.variants && rawProduct.variants.edges.length > 0) {
      console.log(`  Total variants: ${rawProduct.variants.edges.length}`);
      rawProduct.variants.edges.forEach((edge: any, index: number) => {
        const variant = edge.node;
        console.log(`\n  Variant ${index + 1}: ${variant.title}`);
        console.log(`    Available: ${variant.availableForSale}`);
        console.log(`    Price: ${variant.price.amount} ${variant.price.currencyCode}`);
        console.log(`    Selected Options:`);
        variant.selectedOptions.forEach((opt: any) => {
          console.log(`      ${opt.name}: ${opt.value}`);
        });
      });
    } else {
      console.log("  ❌ No variants found");
    }

    // Map the product
    const mappedProduct = mapProduct(rawProduct);

    console.log("\n" + "=".repeat(80));
    console.log("MAPPED PRODUCT DATA (What components receive)");
    console.log("=".repeat(80));
    
    console.log("\n📋 Basic Info:");
    console.log(`  Title: ${mappedProduct.title}`);
    console.log(`  Vendor: ${mappedProduct.vendor}`);
    console.log(`  Available: ${mappedProduct.available}`);

    console.log("\n🎨 OPTIONS:");
    if (mappedProduct.options && mappedProduct.options.length > 0) {
      mappedProduct.options.forEach((opt: any) => {
        console.log(`  ${opt.name} (position ${opt.position}):`);
        console.log(`    Values: ${opt.values.join(", ")}`);
      });
    } else {
      console.log("  ❌ No options found");
    }

    console.log("\n📦 VARIANTS:");
    if (mappedProduct.variants && mappedProduct.variants.length > 0) {
      console.log(`  Total variants: ${mappedProduct.variants.length}`);
      mappedProduct.variants.forEach((variant: any, index: number) => {
        console.log(`\n  Variant ${index + 1}: ${variant.title}`);
        console.log(`    Available: ${variant.available}`);
        console.log(`    Price: $${(variant.price / 100).toFixed(2)}`);
        console.log(`    Option1: ${variant.option1}`);
        console.log(`    Option2: ${variant.option2}`);
        console.log(`    Option3: ${variant.option3}`);
      });
    } else {
      console.log("  ❌ No variants found");
    }

    // Test COLOR component
    console.log("\n" + "=".repeat(80));
    console.log("🎨 COLOR COMPONENT TEST");
    console.log("=".repeat(80));

    const colorOption = mappedProduct.options.find(
      (opt: any) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour"
    );

    if (colorOption) {
      console.log(`\n✅ Color option found: "${colorOption.name}"`);
      console.log(`   Position: ${colorOption.position}`);
      console.log(`   Available values: ${colorOption.values.join(", ")}`);
      
      console.log("\n   Checking variant availability by color:");
      colorOption.values.forEach((color: string) => {
        const availableVariants = mappedProduct.variants.filter((v: any) => {
          const optionIndex = colorOption.position - 1;
          const variantColor = [v.option1, v.option2, v.option3][optionIndex];
          return variantColor === color && v.available;
        });
        const status = availableVariants.length > 0 ? '✅ Available' : '❌ Not available or not in stock';
        console.log(`     • ${color}: ${status} (${availableVariants.length} variants)`);
      });
    } else {
      console.log("\n❌ No color option found");
      console.log("   Available options:");
      mappedProduct.options.forEach((opt: any) => {
        console.log(`     - ${opt.name}`);
      });
    }

    // Test SIZE component
    console.log("\n" + "=".repeat(80));
    console.log("📏 SIZE COMPONENT TEST");
    console.log("=".repeat(80));

    const sizeOption = mappedProduct.options.find(
      (opt: any) => opt.name.toLowerCase() === "size"
    );

    if (sizeOption) {
      console.log(`\n✅ Size option found: "${sizeOption.name}"`);
      console.log(`   Position: ${sizeOption.position}`);
      console.log(`   Available values: ${sizeOption.values.join(", ")}`);
      
      console.log("\n   Checking variant availability by size:");
      sizeOption.values.forEach((size: string) => {
        const availableVariants = mappedProduct.variants.filter((v: any) => {
          const optionIndex = sizeOption.position - 1;
          const variantSize = [v.option1, v.option2, v.option3][optionIndex];
          return variantSize === size && v.available;
        });
        const status = availableVariants.length > 0 ? '✅ Available' : '❌ Not available or not in stock';
        console.log(`     • ${size}: ${status} (${availableVariants.length} variants)`);
      });
    } else {
      console.log("\n❌ No size option found");
      console.log("   Available options:");
      mappedProduct.options.forEach((opt: any) => {
        console.log(`     - ${opt.name}`);
      });
    }

    console.log("\n" + "=".repeat(80));
    console.log("✅ Test complete!\n");

  } catch (error) {
    console.error("❌ Error testing product data:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

// Run the test
testDenimJacket();
