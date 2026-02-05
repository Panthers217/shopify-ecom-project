import type { LoaderFunctionArgs, MetaFunction, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import Cart from "~/components/commerce/Cart";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopping Cart - Shopify Storefront" },
    { name: "description", content: "View your shopping cart" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Get cart data from session or Shopify Cart API
  const cartItems = [];
  const cartTotal = 0;
  
  return json({ cartItems, cartTotal });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");

  switch (action) {
    case "update":
      // TODO: Update cart item quantity
      break;
    case "remove":
      // TODO: Remove item from cart
      break;
    case "checkout":
      // TODO: Redirect to checkout
      return redirect("/checkout");
    default:
      break;
  }

  return json({ success: true });
}

export default function CartPage() {
  const { cartItems, cartTotal } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      <Cart items={cartItems} total={cartTotal} />
      
      {cartItems.length > 0 && (
        <Form method="post" className="cart-actions">
          <button type="submit" name="_action" value="checkout">
            Proceed to Checkout
          </button>
        </Form>
      )}
    </div>
  );
}
