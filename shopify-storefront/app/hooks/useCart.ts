/**
 * Re-export everything from CartContext for backward compatibility
 * The cart logic has been moved to a Context Provider pattern.
 */
export { CartProvider, useCart } from "~/contexts/CartContext";
export type { Cart, CartItem } from "~/contexts/CartContext";

