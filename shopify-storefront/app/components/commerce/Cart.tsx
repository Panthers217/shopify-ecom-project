import { Form } from "@remix-run/react";

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  variant_title?: string;
}

interface CartProps {
  items: CartItem[];
  total: number;
}

export default function Cart({ items, total }: CartProps) {
  if (!items || items.length === 0) {
    return (
      <div className="empty-cart">
        <p>Your cart is empty</p>
        <a href="/products" className="continue-shopping">
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-image">
              <img src={item.image} alt={item.title} />
            </div>

            <div className="cart-item-details">
              <h3>{item.title}</h3>
              {item.variant_title && (
                <p className="variant-title">{item.variant_title}</p>
              )}
              <p className="item-price">${(item.price / 100).toFixed(2)}</p>
            </div>

            <div className="cart-item-quantity">
              <Form method="post" className="quantity-form">
                <input type="hidden" name="_action" value="update" />
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  name="quantity"
                  value={item.quantity - 1}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  type="submit"
                  name="quantity"
                  value={item.quantity + 1}
                >
                  +
                </button>
              </Form>
            </div>

            <div className="cart-item-total">
              <p>${((item.price * item.quantity) / 100).toFixed(2)}</p>
            </div>

            <Form method="post" className="remove-form">
              <input type="hidden" name="_action" value="remove" />
              <input type="hidden" name="itemId" value={item.id} />
              <button type="submit" className="remove-btn">
                Remove
              </button>
            </Form>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Subtotal:</span>
          <span className="total-amount">${(total / 100).toFixed(2)}</span>
        </div>
        <p className="tax-note">Taxes and shipping calculated at checkout</p>
      </div>
    </div>
  );
}
