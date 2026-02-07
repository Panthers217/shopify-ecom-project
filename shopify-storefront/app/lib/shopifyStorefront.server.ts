/**
 * Shopify Storefront API Client
 * Handles communication with Shopify's Storefront GraphQL API
 * Supports both direct access tokens and client credentials OAuth flow
 */

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const SHOPIFY_CLIENT_ID = process.env.SHOPIFY_CLIENT_ID;
const SHOPIFY_CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET;

const STOREFRONT_API_VERSION = "2024-10";

// Cache for OAuth access token
let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

if (!SHOPIFY_STORE_DOMAIN) {
  console.warn("SHOPIFY_STORE_DOMAIN not configured in .env file.");
}

if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN && (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET)) {
  console.warn(
    "Shopify credentials not configured. Please set either:\n" +
    "  1. SHOPIFY_STOREFRONT_ACCESS_TOKEN (for direct Storefront API access), OR\n" +
    "  2. SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET (for custom app OAuth)"
  );
}

interface StorefrontAPIOptions {
  query: string;
  variables?: Record<string, unknown>;
}

/**
 * Get access token using client credentials grant flow
 */
async function getAccessTokenViaOAuth(): Promise<string> {
  // Return cached token if still valid
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  if (!SHOPIFY_CLIENT_ID || !SHOPIFY_CLIENT_SECRET || !SHOPIFY_STORE_DOMAIN) {
    throw new Error("Client credentials not configured");
  }

  const tokenUrl = `https://${SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`;
  
  console.log(`[OAuth] Requesting token from: ${tokenUrl}`);
  console.log(`[OAuth] Client ID format: ${SHOPIFY_CLIENT_ID?.substring(0, 10)}...`);
  
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
    console.error(`[OAuth] Token request failed: ${response.status} ${response.statusText}`);
    console.error(`[OAuth] Error details: ${errorText}`);
    throw new Error(`OAuth token request failed: ${response.statusText} - ${errorText}`);
  }
  
  console.log(`[OAuth] Token obtained successfully`);

  const data = await response.json();
  
  if (!data.access_token) {
    throw new Error("No access token received from OAuth flow");
  }

  cachedAccessToken = data.access_token;
  // Tokens typically expire in 24 hours, cache for 23 hours to be safe
  tokenExpiresAt = Date.now() + (23 * 60 * 60 * 1000);
  
  return cachedAccessToken as string;
}

/**
 * Get the appropriate access token (either direct or via OAuth)
 */
async function getAccessToken(): Promise<string> {
  // Prefer direct Storefront Access Token if available
  if (SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  }

  // Fall back to OAuth client credentials flow
  return await getAccessTokenViaOAuth();
}

/**
 * Main Storefront API fetch function
 * Makes GraphQL requests to Shopify Storefront API
 * 
 * @param query - GraphQL query string
 * @param variables - Optional variables for the query
 * @param isRetry - Internal flag to prevent infinite retry loops
 * @returns Typed response data
 */
export async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, any>,
  isRetry: boolean = false
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error("SHOPIFY_STORE_DOMAIN not configured");
  }

  const accessToken = await getAccessToken();
  const url = `https://${SHOPIFY_STORE_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  console.log(`[Storefront API] Request to: ${url}`);
  console.log(`[Storefront API] Token type: ${accessToken.substring(0, 5)}...`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": accessToken,
    },
    body: JSON.stringify({
      query,
      variables: variables || {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[Storefront API] Request failed: ${response.status} ${response.statusText}`);
    console.error(`[Storefront API] Error body: ${errorText}`);
    
    // Handle expired or invalid token
    if ((response.status === 401 || response.status === 403) && !isRetry) {
      console.warn(`[Storefront API] Token appears to be expired or invalid (${response.status})`);
      
      // If using OAuth (not direct token), clear cache and retry with fresh token
      if (!SHOPIFY_STOREFRONT_ACCESS_TOKEN && SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET) {
        console.log(`[Storefront API] Clearing cached token and attempting to refresh...`);
        cachedAccessToken = null;
        tokenExpiresAt = 0;
        
        try {
          return await storefrontFetch<T>(query, variables, true);
        } catch (retryError) {
          throw new Error(
            `Shopify Storefront API authentication failed after token refresh. ` +
            `Please verify your SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET are correct.`
          );
        }
      } else {
        // Direct token - cannot auto-refresh
        throw new Error(
          `Shopify Storefront API authentication failed (${response.status}). ` +
          `Your SHOPIFY_STOREFRONT_ACCESS_TOKEN may have expired or been revoked. ` +
          `Please generate a new token and update your .env file.`
        );
      }
    }
    
    throw new Error(`Shopify Storefront API error: ${response.statusText} - ${errorText}`);
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

/**
 * Legacy alias for storefrontFetch (for backward compatibility)
 * @deprecated Use storefrontFetch instead
 */
export async function storefrontAPI<T>({
  query,
  variables = {},
}: StorefrontAPIOptions): Promise<T> {
  return storefrontFetch<T>(query, variables);
}

/**
 * Helper to check if Shopify credentials are configured
 */
export function isShopifyConfigured(): boolean {
  return Boolean(
    SHOPIFY_STORE_DOMAIN && 
    (SHOPIFY_STOREFRONT_ACCESS_TOKEN || (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET))
  );
}

/**
 * Get the authentication method being used
 */
export function getAuthMethod(): "direct" | "oauth" | "none" {
  if (SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return "direct";
  }
  if (SHOPIFY_CLIENT_ID && SHOPIFY_CLIENT_SECRET) {
    return "oauth";
  }
  return "none";
}
