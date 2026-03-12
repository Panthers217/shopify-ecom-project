/**
 * Manual Test for Customer Authentication
 * 
 * This script tests the customer login functionality directly against Shopify's API.
 * Run with: npx tsx tests/testCustomerAuth.ts
 * 
 * Before running:
 * 1. Make sure your .env file has SESSION_SECRET set
 * 2. Create a test customer in your Shopify store
 * 3. Update TEST_EMAIL and TEST_PASSWORD below with real credentials
 */

import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.resolve(__dirname, "../.env");
config({ path: envPath });

// Import after env is loaded
const { storefrontFetch } = await import("../app/lib/shopifyStorefront.server.js");
const { CUSTOMER_LOGIN_MUTATION, CUSTOMER_CREATE_MUTATION } = await import("../app/lib/queries.js");

console.log("🧪 Customer Authentication Test\n");
console.log("="".repeat(50));

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_EMAIL = "test@example.com"; // Change this to a real test customer email
const TEST_PASSWORD = "testpassword123"; // Change this to the customer's password
const TEST_WRONG_PASSWORD = "wrongpassword";

// ============================================================================
// TEST 1: Login with Valid Credentials
// ============================================================================

async function testValidLogin() {
  console.log("\n📝 Test 1: Login with Valid Credentials");
  console.log("-".repeat(50));
  
  try {
    const response = await storefrontFetch(CUSTOMER_LOGIN_MUTATION, {
      input: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      },
    });

    const { customerAccessToken, customerUserErrors } = response.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      console.log("❌ FAILED: Login returned errors");
      console.log("Errors:", JSON.stringify(customerUserErrors, null, 2));
      return false;
    }

    if (customerAccessToken && customerAccessToken.accessToken) {
      console.log("✅ PASSED: Successfully logged in");
      console.log("Token:", customerAccessToken.accessToken.substring(0, 20) + "...");
      console.log("Expires:", customerAccessToken.expiresAt);
      return true;
    } else {
      console.log("❌ FAILED: No access token returned");
      return false;
    }
  } catch (error: any) {
    console.log("❌ FAILED: Exception thrown");
    console.log("Error:", error.message);
    return false;
  }
}

// ============================================================================
// TEST 2: Login with Invalid Password
// ============================================================================

async function testInvalidPassword() {
  console.log("\n📝 Test 2: Login with Invalid Password");
  console.log("-".repeat(50));
  
  try {
    const response = await storefrontFetch(CUSTOMER_LOGIN_MUTATION, {
      input: {
        email: TEST_EMAIL,
        password: TEST_WRONG_PASSWORD,
      },
    });

    const { customerAccessToken, customerUserErrors } = response.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      console.log("✅ PASSED: Invalid password was rejected");
      console.log("Error message:", customerUserErrors[0].message);
      return true;
    }

    if (customerAccessToken) {
      console.log("❌ FAILED: Invalid password was accepted");
      return false;
    }

    console.log("✅ PASSED: Login rejected without errors (no token)");
    return true;
  } catch (error: any) {
    console.log("❌ FAILED: Exception thrown");
    console.log("Error:", error.message);
    return false;
  }
}

// ============================================================================
// TEST 3: Login with Non-existent Email
// ============================================================================

async function testNonexistentEmail() {
  console.log("\n📝 Test 3: Login with Non-existent Email");
  console.log("-".repeat(50));
  
  try {
    const response = await storefrontFetch(CUSTOMER_LOGIN_MUTATION, {
      input: {
        email: "nonexistent-" + Date.now() + "@example.com",
        password: "somepassword",
      },
    });

    const { customerAccessToken, customerUserErrors } = response.customerAccessTokenCreate;

    if (customerUserErrors.length > 0) {
      console.log("✅ PASSED: Non-existent email was rejected");
      console.log("Error message:", customerUserErrors[0].message);
      return true;
    }

    if (customerAccessToken) {
      console.log("❌ FAILED: Non-existent email was accepted");
      return false;
    }

    console.log("✅ PASSED: Login rejected without errors (no token)");
    return true;
  } catch (error: any) {
    console.log("❌ FAILED: Exception thrown");
    console.log("Error:", error.message);
    return false;
  }
}

// ============================================================================
// TEST 4: Validate Session Secret
// ============================================================================

function testSessionSecret() {
  console.log("\n📝 Test 4: Validate Session Secret");
  console.log("-".repeat(50));
  
  const sessionSecret = process.env.SESSION_SECRET;
  
  if (!sessionSecret) {
    console.log("❌ FAILED: SESSION_SECRET is not set in .env");
    return false;
  }
  
  if (sessionSecret.length < 32) {
    console.log("❌ FAILED: SESSION_SECRET is too short (should be at least 32 characters)");
    console.log("Current length:", sessionSecret.length);
    return false;
  }
  
  console.log("✅ PASSED: SESSION_SECRET is properly configured");
  console.log("Length:", sessionSecret.length);
  return true;
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
  console.log("\n🚀 Starting Authentication Tests...\n");
  
  const results = {
    sessionSecret: false,
    validLogin: false,
    invalidPassword: false,
    nonexistentEmail: false,
  };

  // Test 4: Session Secret (run first)
  results.sessionSecret = testSessionSecret();

  // Only continue with API tests if session secret is valid
  if (!results.sessionSecret) {
    console.log("\n⚠️  Skipping API tests due to missing SESSION_SECRET");
    console.log("Please add SESSION_SECRET to your .env file");
    console.log("Generate one with: openssl rand -hex 32");
    return results;
  }

  // Test 1: Valid Login
  results.validLogin = await testValidLogin();

  // Test 2: Invalid Password
  results.invalidPassword = await testInvalidPassword();

  // Test 3: Non-existent Email
  results.nonexistentEmail = await testNonexistentEmail();

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  console.log(`\nTotal: ${passed}/${total} tests passed\n`);
  console.log("Results:");
  console.log(`  ${results.sessionSecret ? "✅" : "❌"} Session Secret Configuration`);
  console.log(`  ${results.validLogin ? "✅" : "❌"} Valid Login`);
  console.log(`  ${results.invalidPassword ? "✅" : "❌"} Invalid Password Rejection`);
  console.log(`  ${results.nonexistentEmail ? "✅" : "❌"} Non-existent Email Rejection`);
  
  if (passed === total) {
    console.log("\n🎉 All tests passed! Authentication is working correctly.\n");
  } else {
    console.log("\n⚠️  Some tests failed. Please review the results above.\n");
  }
  
  return results;
}

// Run tests
runAllTests()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error running tests:");
    console.error(error);
    process.exit(1);
  });
