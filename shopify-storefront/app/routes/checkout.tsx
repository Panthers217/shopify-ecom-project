import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Checkout from "~/components/commerce/Checkout";

export const meta: MetaFunction = () => {
  return [
    { title: "Checkout - Shopify Storefront" },
    { name: "description", content: "Complete your purchase" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Get cart data and create checkout URL
  const cartItems = [];
  const checkoutUrl = null;

  if (cartItems.length === 0) {
    return redirect("/cart");
  }

  // If we have a Shopify checkout URL, redirect to it
  if (checkoutUrl) {
    return redirect(checkoutUrl);
  }
  
  return json({ cartItems, checkoutUrl });
}

export default function CheckoutPage() {
  const { cartItems, checkoutUrl } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>Checkout</h1>
      <Checkout items={cartItems} checkoutUrl={checkoutUrl} />
    </div>
  );
}
