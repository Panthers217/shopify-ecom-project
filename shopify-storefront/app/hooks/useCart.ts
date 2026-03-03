import { useCallback, useEffect, useState } from "react";

/**
 * Cart item from Shopify Storefront GraphQL API
 */
export interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  url: string;
  handle: string;
}

/**
 * Cart data structure from Shopify Storefront GraphQL API
 */
export interface Cart {
  id: string;
  itemCount: number;
  totalPrice: number;
  items: CartItem[];
}

type CartApiResponse = {
  cart?: Cart | null;
  error?: string;
};

/**
 * Call our backend cart API which proxies to Shopify Storefront API
 */
async function cartRequest(payload: Record<string, unknown>): Promise<CartApiResponse> {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as CartApiResponse;

    if (!response.ok) {
      throw new Error(data.error || `Cart request failed: ${response.status}`);
    }

    return data;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cart request failed";
    throw new Error(message);
  }
}

/**
 * useCart - Cart management hook using Shopify Storefront GraphQL API
 *
 * Features:
 * - Uses Shopify Storefront API (designed for custom apps)
 * - Backend proxies requests with proper authentication
 * - Real-time cart state updates
 * - Automatic cart synchronization on mount
 * - Persists cart ID to localStorage for cross-session access
 */
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save cart ID to localStorage for persistence
   */
  const saveCartToStorage = useCallback((cartData: Cart) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("shopify_cart_id", cartData.id);
      console.log("💾 Saved cart ID to localStorage:", cartData.id);
    }
  }, []);

  /**
   * Retrieve cart ID from localStorage
   */
  const getCartFromStorage = useCallback((): string | null => {
    if (typeof window !== "undefined") {
      const cartId = localStorage.getItem("shopify_cart_id");
      if (cartId) {
        console.log("📂 Retrieved cart ID from localStorage:", cartId);
      }
      return cartId;
    }
    return null;
  }, []);

  /**
   * Initialize cart on component mount
   * Fetches current cart state from Shopify
   */
  useEffect(() => {
    const initializeCart = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try to get stored cart ID from localStorage
        const storedCartId = getCartFromStorage();
        let data: CartApiResponse;

        if (storedCartId) {
          console.log("🔍 Attempting to retrieve stored cart:", storedCartId);
          data = await cartRequest({ op: "get", cartId: storedCartId });
        } else {
          console.log("No stored cart ID found, creating new cart...");
          data = await cartRequest({ op: "create" });
        }

        // If stored cart is expired/invalid, create new one
        if (!data.cart) {
          console.log("Stored cart not found or expired, creating new cart...");
          data = await cartRequest({ op: "create" });
        }

        if (data.cart) {
          console.log("Cart initialized:", data.cart);
          console.log("Cart items:", data.cart.items);
          setCart(data.cart);
          // Save the cart ID for next session
          saveCartToStorage(data.cart);
        }
      } catch (err) {
        // If get fails, try to create new cart
        try {
          console.log("Get cart failed, creating new cart...");
          const data = await cartRequest({ op: "create" });
          if (data.cart) {
            console.log("New cart created:", data.cart);
            setCart(data.cart);
            saveCartToStorage(data.cart);
          }
        } catch (createErr) {
          const message =
            createErr instanceof Error ? createErr.message : "Failed to initialize cart";
          console.error("Cart initialization error:", message);
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, [saveCartToStorage, getCartFromStorage]);

  /**
   * Add an item to the cart
   */
  const addToCart = useCallback(
    async (variantId: string | number, quantity: number = 1): Promise<boolean> => {
      // If cart not initialized yet, try to initialize it first
      if (!cart) {
        setError("Cart not initialized");
        return false;
      }

      console.log("Adding to cart:", { variantId, quantity, cartId: cart.id });
      setLoading(true);
      setError(null);

      try {
        const data = await cartRequest({
          op: "add",
          cartId: cart.id,
          variantId: String(variantId),
          quantity,
        });

        console.log("Add to cart response:", data);

        if (data.error) {
          console.error("Add to cart error:", data.error);
          setError(data.error);
          return false;
        }

        if (data.cart) {
          console.log("Cart updated:", data.cart);
          console.log("Cart items after add:", data.cart.items);
          setCart(data.cart);
          // Persist updated cart to storage
          saveCartToStorage(data.cart);
          return true;
        }
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to add item to cart";
        setError(errorMsg);
        console.error("Error adding to cart:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart, saveCartToStorage]
  );

  /**
   * Remove an item from the cart
   */
  const removeFromCart = useCallback(
    async (lineId: string): Promise<boolean> => {
      if (!cart) {
        setError("Cart not initialized");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await cartRequest({
          op: "remove",
          cartId: cart.id,
          lineId,
        });

        if (data.error) {
          setError(data.error);
          return false;
        }

        if (data.cart) {
          setCart(data.cart);
          saveCartToStorage(data.cart);
          return true;
        }
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to remove item";
        setError(errorMsg);
        console.error("Error removing from cart:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart, saveCartToStorage]
  );

  /**
   * Update the quantity of an item in the cart
   */
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number): Promise<boolean> => {
      if (!cart) {
        setError("Cart not initialized");
        return false;
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

        console.log("📝 Update quantity response:", data);
        console.log("📊 Updated cart itemCount:", data.cart?.itemCount);

        if (data.error) {
          setError(data.error);
          return false;
        }

        if (data.cart) {
          console.log("🔄 Setting cart state with new itemCount:", data.cart.itemCount);
          setCart(data.cart);
          saveCartToStorage(data.cart);
          return true;
        }
        return false;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to update quantity";
        setError(errorMsg);
        console.error("Error updating quantity:", err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [cart, removeFromCart, saveCartToStorage]
  );

  /**
   * Clear all items from the cart
   */
  const clearCart = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const data = await cartRequest({
        op: "clear",
      });

      if (data.error) {
        setError(data.error);
        return false;
      }

      if (data.cart) {
        setCart(data.cart);
        saveCartToStorage(data.cart);
        return true;
      }
      return false;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to clear cart";
      setError(errorMsg);
      console.error("Error clearing cart:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [saveCartToStorage]);

  // Calculate totals
  const totalItems = cart?.itemCount ?? 0;
  const totalPrice = cart?.totalPrice ?? 0;

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    setError,
  };
}
