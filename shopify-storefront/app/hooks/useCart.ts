import { useCallback, useEffect, useState } from "react";

export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage?: {
        url: string;
        altText?: string;
      };
    };
    priceV2: {
      amount: string;
      currencyCode: string;
    };
    image: {
      url: string;
      altText?: string;
    };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  estimatedCost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    subtotalAmount?: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    };
  };
}

const CART_ID_STORAGE_KEY = "shopify-cart-id";

type CartApiResponse = {
  cart?: Cart | null;
  userErrors?: Array<{ field: string[]; message: string }>;
  error?: string;
};

async function cartRequest(payload: Record<string, unknown>): Promise<CartApiResponse> {
  const response = await fetch("/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CartApiResponse;

  if (!response.ok) {
    throw new Error(data.error || "Cart request failed");
  }

  return data;
}

/**
 * useCart - Hybrid cart management hook
 * 
 * Manages cart state with:
 * - localStorage for persistence across sessions
 * - Shopify Storefront API for real-time data
 * - Optimistic updates for instant UI feedback
 */
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true);
      try {
        const savedCartId = localStorage.getItem(CART_ID_STORAGE_KEY);

        if (savedCartId) {
          // Try to fetch existing cart
          const data = await cartRequest({
            op: "get",
            cartId: savedCartId,
          });

          if (data.cart) {
            setCart(data.cart);
            return;
          } else {
            // Saved cart ID is invalid, clear it
            localStorage.removeItem(CART_ID_STORAGE_KEY);
          }
        }

        // No valid saved cart, create a new one
        const createData = await cartRequest({ op: "create" });

        if (createData.cart) {
          const newCart = createData.cart;
          setCart(newCart);
          localStorage.setItem(CART_ID_STORAGE_KEY, newCart.id);
        }
      } catch (err) {
        console.error("Error initializing cart:", err);
        setError("Failed to initialize cart");
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, []);

  // Add item to cart
  const addToCart = useCallback(
    async (variantId: string, quantity: number = 1) => {
      if (!cart) {
        setError("Cart not initialized");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await cartRequest({
          op: "add",
          cartId: cart.id,
          variantId,
          quantity,
        });

        if (data.userErrors && data.userErrors.length > 0) {
          const errorMessage = data.userErrors[0].message;
          setError(errorMessage);
          return false;
        }

        if (data.cart) {
          setCart(data.cart);
        }
        return true;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to add item to cart";
        setError(errorMsg);
        console.error("Error adding to cart:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // Remove item from cart
  const removeFromCart = useCallback(
    async (lineId: string) => {
      if (!cart) {
        setError("Cart not initialized");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await cartRequest({
          op: "remove",
          cartId: cart.id,
          lineId,
        });

        if (data.userErrors && data.userErrors.length > 0) {
          setError(data.userErrors[0].message);
          return false;
        }

        if (data.cart) {
          setCart(data.cart);
        }
        return true;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to remove item";
        setError(errorMsg);
        console.error("Error removing from cart:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart]
  );

  // Update quantity
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) {
        setError("Cart not initialized");
        return;
      }

      if (quantity <= 0) {
        return removeFromCart(lineId);
      }

      setLoading(true);
      setError(null);

      try {
        const data = await cartRequest({
          op: "update",
          cartId: cart.id,
          lineId,
          quantity,
        });

        if (data.userErrors && data.userErrors.length > 0) {
          setError(data.userErrors[0].message);
          return false;
        }

        if (data.cart) {
          setCart(data.cart);
        }
        return true;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to update quantity";
        setError(errorMsg);
        console.error("Error updating quantity:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart, removeFromCart]
  );

  // Get total items in cart
  const totalItems = cart?.lines.reduce((sum, line) => sum + line.quantity, 0) || 0;

  // Get total price
  const totalPrice = cart ? parseFloat(cart.estimatedCost.totalAmount.amount) : 0;

  // Checkout URL
  const checkoutUrl = cart?.checkoutUrl || null;

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    checkoutUrl,
  };
}
