"use client";

import { useCart } from "~/hooks/useCart";

export default function Cart() {
  const { cart, loading, removeFromCart, updateQuantity } = useCart();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
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

  const subtotal = parseFloat(cart.estimatedCost.subtotalAmount?.amount || "0");
  const tax = parseFloat(cart.estimatedCost.totalTaxAmount?.amount || "0");
  const total = parseFloat(cart.estimatedCost.totalAmount.amount);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-4 border-b border-gray-200 pb-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText || line.merchandise.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <a
                        href={`/products/${line.merchandise.product.handle}`}
                        className="text-lg font-semibold text-gray-900 hover:text-pink-600"
                      >
                        {line.merchandise.product.title}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        {line.merchandise.title}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        ${parseFloat(line.merchandise.priceV2.amount).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity and Remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={line.quantity <= 1 || loading}
                          className="px-3 py-1 hover:bg-gray-100 disabled:text-gray-300"
                        >
                          −
                        </button>
                        <span className="px-4">{line.quantity}</span>
                        <button
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={loading}
                          className="px-3 py-1 hover:bg-gray-100 disabled:text-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(line.id)}
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
                      ${(parseFloat(line.merchandise.priceV2.amount) * line.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
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
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
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

              <a
                href={cart.checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-pink-100 hover:bg-pink-200 text-gray-900 font-semibold py-3 px-4 rounded transition-colors mb-3"
              >
                Proceed to Checkout
              </a>

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
