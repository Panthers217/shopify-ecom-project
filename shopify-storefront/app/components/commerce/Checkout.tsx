interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  checkoutUrl: string | null;
}

export default function Checkout({ items, checkoutUrl }: CheckoutProps) {
  if (checkoutUrl) {
    return (
      <div className="checkout-redirect">
        <p>Redirecting to Shopify checkout...</p>
        <p>If not redirected automatically, <a href={checkoutUrl}>click here</a>.</p>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="checkout">
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        
        <div className="checkout-items">
          {items.map((item) => (
            <div key={item.id} className="checkout-item">
              <div className="item-info">
                <span className="item-title">{item.title}</span>
                <span className="item-quantity">x{item.quantity}</span>
              </div>
              <span className="item-total">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="checkout-totals">
          <div className="total-line">
            <span>Subtotal:</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="total-line">
            <span>Shipping:</span>
            <span>Calculated at next step</span>
          </div>
          <div className="total-line">
            <span>Tax:</span>
            <span>Calculated at next step</span>
          </div>
          <div className="total-line grand-total">
            <span>Total:</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="checkout-form">
        <p>Checkout functionality requires Shopify Storefront API integration.</p>
        <p>Configure your Shopify store credentials in the .env file.</p>
      </div>
    </div>
  );
}
