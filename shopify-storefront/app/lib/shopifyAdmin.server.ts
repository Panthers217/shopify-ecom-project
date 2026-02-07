/**
 * Shopify Admin API Client
 * Handles communication with Shopify's Admin GraphQL API
 * Allows full store management capabilities (products, collections, orders, etc.)
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const ADMIN_API_VERSION = "2025-01";

// Cache for OAuth access token
let cachedAdminAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

if (!SHOPIFY_STORE_DOMAIN) {
  console.warn("SHOPIFY_STORE_DOMAIN not configured in .env file.");
}

if (!SHOPIFY_ADMIN_ACCESS_TOKEN && (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET)) {
  console.warn(
    "Shopify Admin credentials not configured. Please set either:\n" +
    "  1. SHOPIFY_ADMIN_ACCESS_TOKEN (for direct Admin API access), OR\n" +
    "  2. SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (for custom app OAuth)"
  );
}

interface AdminAPIOptions {
  query: string;
  variables?: Record<string, unknown>;
}

/**
 * Get access token using client credentials grant flow
 * This token will work for both Storefront and Admin APIs
 */
async function getAdminAccessTokenViaOAuth(): Promise<string> {
  // Return cached token if still valid
  if (cachedAdminAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAdminAccessToken;
  }

  if (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET || !SHOPIFY_STORE_DOMAIN) {
    throw new Error("Client credentials not configured");
  }

  const tokenUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`;
  
  console.log(`[Admin OAuth] Requesting token from: ${tokenUrl}`);
  console.log(`[Admin OAuth] Client ID: ${SHOPIFY_CLIENT_ID?.substring(0, 10)}...`);
  
  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: SHOPIFY_CLIENT_ID,
      client_secret: SHOPIFY_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Admin OAuth] Token request failed: ${response.status} ${response.statusText}`);
    console.error(`[Admin OAuth] Error details: ${errorText}`);
    throw new Error(`Admin OAuth token request failed: ${response.statusText} - ${errorText}`);
  }
  
  console.log(`[Admin OAuth] Token obtained successfully`);

  const data = await response.json();
  
  if (!data.access_token) {
    throw new Error("No access token received from Admin OAuth flow");
  }

  cachedAdminAccessToken = data.access_token;
  // Tokens typically expire in 24 hours, cache for 23 hours to be safe
  tokenExpiresAt = Date.now() + (23 * 60 * 60 * 1000);
  
  console.log(`[Admin OAuth] Token cached until: ${new Date(tokenExpiresAt).toISOString()}`);
  
  return cachedAdminAccessToken as string;
}

/**
 * Get the appropriate admin access token (either direct or via OAuth)
 */
async function getAdminAccessToken(): Promise<string> {
  // Prefer direct Admin Access Token if available
  if (SHOPIFY_ADMIN_ACCESS_TOKEN) {
    console.log(`[Admin Auth] Using direct admin access token`);
    return SHOPIFY_ADMIN_ACCESS_TOKEN;
  }

  // Fall back to OAuth client credentials flow
  console.log(`[Admin Auth] Using OAuth client credentials flow`);
  return await getAdminAccessTokenViaOAuth();
}

/**
 * Main Admin API fetch function
 * Makes GraphQL requests to Shopify Admin API
 * 
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @param isRetry - Internal flag to prevent infinite retry loops
 * @returns Typed response data
 */
export async function adminFetch<T>(
  query: string,
  variables?: Record<string, any>,
  isRetry: boolean = false
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error("SHOPIFY_STORE_DOMAIN not configured");
  }

  const accessToken = await getAdminAccessToken();
  const url = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${ADMIN_API_VERSION}/graphql.json`;

  console.log(`[Admin API] Request to: ${url}`);
  console.log(`[Admin API] Using access token: ${accessToken.substring(0, 10)}...`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Admin API] Request failed: ${response.status} ${response.statusText}`);
    console.error(`[Admin API] Error body: ${errorText}`);
    
    // Handle expired or invalid token
    if ((response.status === 401 || response.status === 403) && !isRetry) {
      console.warn(`[Admin API] Token appears to be expired or invalid (${response.status})`);
      
      // If using OAuth (not direct token), clear cache and retry with fresh token
      if (!SHOPIFY_ADMIN_ACCESS_TOKEN && SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET) {
        console.log(`[Admin API] Clearing cached token and attempting to refresh...`);
        cachedAdminAccessToken = null;
        tokenExpiresAt = 0;
        
        try {
          return await adminFetch<T>(query, variables, true);
        } catch (retryError) {
          throw new Error(
            `Shopify Admin API authentication failed after token refresh. ` +
            `Please verify your SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are correct.`
          );
        }
      } else {
        // Direct token - cannot auto-refresh
        throw new Error(
          `Shopify Admin API authentication failed (${response.status}). ` +
          `Your SHOPIFY_ADMIN_ACCESS_TOKEN may have expired or been revoked. ` +
          `Please generate a new token and update your .env file.`
        );
      }
    }
    
    throw new Error(`Shopify Admin API error: ${response.statusText} - ${errorText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error(`[Admin API] GraphQL errors:`, JSON.stringify(json.errors, null, 2));
    throw new Error(`Admin API GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

/**
 * Legacy alias for adminFetch (for backward compatibility)
 */
export async function adminAPI<T>({
  query,
  variables = {},
}: AdminAPIOptions): Promise<T> {
  return adminFetch<T>(query, variables);
}

/**
 * Helper to check if Shopify Admin credentials are configured
 */
export function isAdminConfigured(): boolean {
  return Boolean(
    SHOPIFY_STORE_DOMAIN && 
    (SHOPIFY_ADMIN_ACCESS_TOKEN || (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET))
  );
}

/**
 * Get the authentication method being used for Admin API
 */
export function getAdminAuthMethod(): "direct" | "oauth" | "none" {
  if (SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return "direct";
  }
  if (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET) {
    return "oauth";
  }
  return "none";
}

/**
 * Test the admin API connection
 */
export async function testAdminConnection(): Promise<{
  success: boolean;
  shopInfo?: {
    name: string;
    email: string;
    domain: string;
    currencyCode: string;
  };
  error?: string;
}> {
  try {
    const query = `
      query {
        shop {
          name
          email
          myshopifyDomain
          currencyCode
        }
      }
    `;

    const result = await adminFetch<{
      shop: {
        name: string;
        email: string;
        myshopifyDomain: string;
        currencyCode: string;
      };
    }>(query);

    return {
      success: true,
      shopInfo: {
        name: result.shop.name,
        email: result.shop.email,
        domain: result.shop.myshopifyDomain,
        currencyCode: result.shop.currencyCode,
      },
    };
  } catch (error) {
    console.error(`[Admin API] Connection test failed:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
