import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
  throw new Error(
    "SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN environment variables are required"
  );
}

// GraphQL Queries and Mutations
const GET_CART_QUERY = `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product {
                  id
                  title
                  handle
                  featuredImage {
                    url
                    altText
                  }
                }
                priceV2 {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
      }
      estimatedCost {
        totalAmount {
          amount
          currencyCode
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation createCart {
    cartCreate(input: {}) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_TO_CART_MUTATION = `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CART_LINE_MUTATION = `
  mutation updateCartLine($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
        checkoutUrl
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    featuredImage {
                      url
                      altText
                    }
                  }
                  priceV2 {
                    amount
                    currencyCode
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Call Shopify Storefront API
async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const payload = {
    query,
    variables,
  };
  
  console.log("🌐 Shopify API Request:", JSON.stringify(payload, null, 2));
  
  const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  
  console.log("🌐 Shopify API Response:", JSON.stringify(result, null, 2));

  if (result.errors) {
    const errorMessage = result.errors.map((e: { message: string }) => e.message).join(", ");
    throw new Error(`Shopify API Error: ${errorMessage}`);
  }

  return result.data as T;
}

// Format ID to GID format
function toGid(id: string, type: "Cart" | "ProductVariant" | "CartLine"): string {
  if (id.startsWith("gid://")) return id;
  return `gid://shopify/${type}/${id}`;
}

// Normalize cart response
function normalizeCart(shopifyCart: any) {
  if (!shopifyCart) return null;

  console.log("🔍 Normalizing Shopify cart:", JSON.stringify(shopifyCart, null, 2));

  const items = shopifyCart.lines.edges.map((edge: any) => {
    const node = edge.node;
    const merchandise = node.merchandise;
    return {
      id: node.id,
      variantId: merchandise.id,
      productId: merchandise.product.id,
      title: merchandise.title,
      image: merchandise.image?.url || merchandise.product.featuredImage?.url || "",
      price: parseFloat(merchandise.priceV2.amount),
      quantity: node.quantity,
      url: merchandise.product.handle,
      handle: merchandise.product.handle,
    };
  });

  // Match Shopify cart.item_count behavior by summing all line quantities.
  const itemCount = items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

  const normalized = {
    id: shopifyCart.id,
    itemCount,
    totalPrice: parseFloat(shopifyCart.estimatedCost.totalAmount.amount),
    items,
  };

  console.log("✅ Normalized cart:", JSON.stringify(normalized, null, 2));

  return normalized;
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const op = body?.op as string | undefined;

    if (!op) {
      return json({ error: "Missing operation" }, { status: 400 });
    }

    // GET - Retrieve cart
    if (op === "get") {
      const requestedCartId = body.cartId || "default";
      console.log("📖 GET cart operation:", { requestedCartId });
      
      try {
        const result = await storefrontFetch<{ cart: any }>(GET_CART_QUERY, {
          cartId: toGid(requestedCartId, "Cart"),
        });
        
        console.log("📨 Cart get response:", JSON.stringify(result.cart, null, 2));
        
        return json({ cart: normalizeCart(result.cart) });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("❌ Get cart error:", message);
        
        // Return empty cart on error
        return json({
          cart: {
            id: "",
            itemCount: 0,
            totalPrice: 0,
            items: [],
          },
        });
      }
    }

    // CREATE - Create new cart
    if (op === "create") {
      console.log("🆕 CREATE cart operation");
      try {
        const result = await storefrontFetch<{ cartCreate: { cart: any; userErrors: any[] } }>(
          CREATE_CART_MUTATION
        );

        console.log("📨 Cart create response:", JSON.stringify(result.cartCreate, null, 2));

        if (result.cartCreate.userErrors?.length) {
          console.error("❌ User errors:", result.cartCreate.userErrors);
          return json({ error: result.cartCreate.userErrors[0].message }, { status: 400 });
        }

        return json({ cart: normalizeCart(result.cartCreate.cart) });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create cart";
        console.error("❌ Create cart error:", message);
        return json({ error: message }, { status: 500 });
      }
    }

    // ADD - Add item to cart
    if (op === "add") {
      if (!body.variantId) {
        return json({ error: "Missing variantId" }, { status: 400 });
      }

      console.log("🛒 ADD operation:", {
        cartId: body.cartId,
        variantId: body.variantId,
        quantity: body.quantity,
      });

      try {
        const cartGid = toGid(body.cartId || "", "Cart");
        const variantGid = toGid(body.variantId, "ProductVariant");

        console.log("📦 Calling Shopify with:", { cartGid, variantGid, quantity: body.quantity || 1 });

        const result = await storefrontFetch<{ cartLinesAdd: { cart: any; userErrors: any[] } }>(
          ADD_TO_CART_MUTATION,
          {
            cartId: cartGid,
            lines: [
              {
                merchandiseId: variantGid,
                quantity: body.quantity || 1,
              },
            ],
          }
        );

        console.log("📨 Shopify response:", JSON.stringify(result.cartLinesAdd, null, 2));

        if (result.cartLinesAdd.userErrors?.length) {
          console.error("❌ User errors:", result.cartLinesAdd.userErrors);
          return json({ error: result.cartLinesAdd.userErrors[0].message }, { status: 400 });
        }

        return json({ cart: normalizeCart(result.cartLinesAdd.cart) });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to add item";
        console.error("❌ Add to cart error:", message);
        return json({ error: message }, { status: 500 });
      }
    }

    // UPDATE - Update line item quantity
    if (op === "update") {
      if (!body.lineId || typeof body.quantity !== "number") {
        return json({ error: "Missing lineId or quantity" }, { status: 400 });
      }

      console.log("🔄 UPDATE operation:", {
        cartId: body.cartId,
        lineId: body.lineId,
        quantity: body.quantity,
      });

      try {
        const result = await storefrontFetch<{ cartLinesUpdate: { cart: any; userErrors: any[] } }>(
          UPDATE_CART_LINE_MUTATION,
          {
            cartId: toGid(body.cartId || "", "Cart"),
            lines: [
              {
                id: toGid(body.lineId, "CartLine"),
                quantity: body.quantity,
              },
            ],
          }
        );

        console.log("📨 Shopify UPDATE response:", JSON.stringify(result.cartLinesUpdate, null, 2));

        if (result.cartLinesUpdate.userErrors?.length) {
          return json({ error: result.cartLinesUpdate.userErrors[0].message }, { status: 400 });
        }

        return json({ cart: normalizeCart(result.cartLinesUpdate.cart) });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update cart";
        return json({ error: message }, { status: 500 });
      }
    }

    // REMOVE - Remove item from cart
    if (op === "remove") {
      if (!body.lineId) {
        return json({ error: "Missing lineId" }, { status: 400 });
      }

      try {
        const result = await storefrontFetch<{ cartLinesRemove: { cart: any; userErrors: any[] } }>(
          REMOVE_FROM_CART_MUTATION,
          {
            cartId: toGid(body.cartId || "", "Cart"),
            lineIds: [toGid(body.lineId, "CartLine")],
          }
        );

        if (result.cartLinesRemove.userErrors?.length) {
          return json({ error: result.cartLinesRemove.userErrors[0].message }, { status: 400 });
        }

        return json({ cart: normalizeCart(result.cartLinesRemove.cart) });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove item";
        return json({ error: message }, { status: 500 });
      }
    }

    return json({ error: "Unsupported operation" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ error: message }, { status: 500 });
  }
}
