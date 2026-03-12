/**
 * Logout Route
 * Destroys the customer session and redirects to home
 */

import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroyUserSession, getUserSession } from "~/lib/session.server";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { CUSTOMER_LOGOUT_MUTATION } from "~/lib/queries";

export async function action({ request }: ActionFunctionArgs) {
  const customerAccessToken = await getUserSession(request);
  
  // If there's a token, invalidate it on Shopify's side
  if (customerAccessToken) {
    try {
      await storefrontFetch(CUSTOMER_LOGOUT_MUTATION, {
        customerAccessToken,
      });
    } catch (error) {
      console.error("Error invalidating token on Shopify:", error);
      // Continue with session destruction even if Shopify call fails
    }
  }
  
  // Destroy the session and redirect
  return destroyUserSession(request);
}

export async function loader() {
  return redirect("/");
}
