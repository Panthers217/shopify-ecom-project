import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  ADD_TO_CART_MUTATION,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION,
} from "~/lib/queries";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";

type CartLineNode = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product?: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: {
        url: string;
        altText?: string;
      };
    };
    priceV2?: {
      amount: string;
      currencyCode: string;
    };
    image?: {
      url: string;
      altText?: string;
    };
  };
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines: {
    edges: Array<{ node: CartLineNode }>;
  };
  estimatedCost: {
    totalAmount: { amount: string; currencyCode: string };
    subtotalAmount?: { amount: string; currencyCode: string };
    totalTaxAmount?: { amount: string; currencyCode: string };
  };
};

function toShopifyGid(rawId: unknown, entity: "ProductVariant" | "Cart" | "CartLine"): string {
  const value = String(rawId || "").trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("gid://")) {
    return value;
  }

  // Support numeric IDs emitted by our product mapper.
  if (/^\d+$/.test(value)) {
    return `gid://shopify/${entity}/${value}`;
  }

  return value;
}

function normalizeCart(cart: ShopifyCart | null) {
  if (!cart) {
    return null;
  }

  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lines: (cart.lines?.edges || []).map((edge) => edge.node),
    estimatedCost: {
      totalAmount: cart.estimatedCost?.totalAmount,
      subtotalAmount: cart.estimatedCost?.subtotalAmount,
      totalTaxAmount: cart.estimatedCost?.totalTaxAmount,
    },
  };
}

function badRequest(message: string) {
  return json({ error: message }, { status: 400 });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const op = body?.op as string | undefined;

    if (!op) {
      return badRequest("Missing operation");
    }

    if (op === "get") {
      if (!body.cartId) {
        return badRequest("Missing cartId");
      }

      const cartId = toShopifyGid(body.cartId, "Cart");

      const data = await storefrontFetch<{ cart: ShopifyCart | null }>(GET_CART_QUERY, {
        cartId,
      });

      return json({ cart: normalizeCart(data.cart) });
    }

    if (op === "create") {
      const data = await storefrontFetch<{
        cartCreate: {
          cart: ShopifyCart | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(CREATE_CART_MUTATION, {
        input: { lines: [] },
      });

      return json({
        cart: normalizeCart(data.cartCreate.cart),
        userErrors: data.cartCreate.userErrors,
      });
    }

    if (op === "add") {
      if (!body.cartId || !body.variantId) {
        return badRequest("Missing cartId or variantId");
      }

      const cartId = toShopifyGid(body.cartId, "Cart");
      const variantId = toShopifyGid(body.variantId, "ProductVariant");

      const data = await storefrontFetch<{
        cartLinesAdd: {
          cart: ShopifyCart | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity: Number(body.quantity || 1),
          },
        ],
      });

      return json({
        cart: normalizeCart(data.cartLinesAdd.cart),
        userErrors: data.cartLinesAdd.userErrors,
      });
    }

    if (op === "update") {
      if (!body.cartId || !body.lineId || typeof body.quantity !== "number") {
        return badRequest("Missing cartId, lineId, or quantity");
      }

      const cartId = toShopifyGid(body.cartId, "Cart");
      const lineId = toShopifyGid(body.lineId, "CartLine");

      const data = await storefrontFetch<{
        cartLinesUpdate: {
          cart: ShopifyCart | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(UPDATE_CART_LINE_MUTATION, {
        cartId,
        lines: [
          {
            id: lineId,
            quantity: body.quantity,
          },
        ],
      });

      return json({
        cart: normalizeCart(data.cartLinesUpdate.cart),
        userErrors: data.cartLinesUpdate.userErrors,
      });
    }

    if (op === "remove") {
      if (!body.cartId || !body.lineId) {
        return badRequest("Missing cartId or lineId");
      }

      const cartId = toShopifyGid(body.cartId, "Cart");
      const lineId = toShopifyGid(body.lineId, "CartLine");

      const data = await storefrontFetch<{
        cartLinesRemove: {
          cart: ShopifyCart | null;
          userErrors: Array<{ field: string[]; message: string }>;
        };
      }>(REMOVE_FROM_CART_MUTATION, {
        cartId,
        lineIds: [lineId],
      });

      return json({
        cart: normalizeCart(data.cartLinesRemove.cart),
        userErrors: data.cartLinesRemove.userErrors,
      });
    }

    return badRequest("Unsupported operation");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown cart API error";
    return json({ error: message }, { status: 500 });
  }
}
