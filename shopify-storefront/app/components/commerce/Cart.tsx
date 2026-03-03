"use client";

import { memo, useEffect, useState } from "react";
import { useCart } from "~/hooks/useCart";
import type { CartItem } from "~/hooks/useCart";

// Memoized cart line item - only re-renders when its own data changes
const CartLineItem = memo(function CartLineItem({
  item,
  loading,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  loading: boolean;
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<boolean>;
  onRemove: (lineId: string) => Promise<boolean>;
}) {
  return (
    <div className="flex gap-4 border-b border-gray-200 pb-4">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        {item.image && (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <a
            href={`/products/${item.handle}`}
            className="text-lg font-semibold text-gray-900 hover:text-pink-600"
          >
            {item.title}
          </a>
          <p className="text-sm font-semibold text-gray-900 mt-2">
            ${item.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity and Remove */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 border border-gray-300 rounded">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || loading}
              className="px-3 py-1 hover:bg-gray-100 disabled:text-gray-300"
            >
              −
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={loading}
              className="px-3 py-1 hover:bg-gray-100 disabled:text-gray-300"
            >
              +
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            disabled={loading}
            className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-300"
          >
            Remove
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  );
});

export default function Cart() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Track when cart has loaded at least once
  useEffect(() => {
    if (cart !== null) {
      setIsInitialLoad(false);
    }
  }, [cart]);

  // Only show full loading screen on initial load
  if (isInitialLoad && loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-lg text-gray-600 mb-6">Your cart is empty</p>
          <a 
            href="/products" 
            className="inline-block bg-pink-100 hover:bg-pink-200 text-gray-900 font-semibold py-2 px-6 rounded"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  const total = cart.totalPrice;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  loading={loading}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6 border-b border-gray-200 pb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => alert('Checkout functionality will be implemented')}
                className="w-full block text-center bg-pink-100 hover:bg-pink-200 text-gray-900 font-semibold py-3 px-4 rounded transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              <a
                href="/products"
                className="w-full block text-center border border-gray-300 text-gray-900 font-semibold py-3 px-4 rounded hover:bg-gray-100 transition-colors"
              >
                Continue Shopping
              </a>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
