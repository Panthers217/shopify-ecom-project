import type { MetaFunction } from "@remix-run/node";
import Cart from "~/components/commerce/Cart";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopping Cart - Your Store" },
    { name: "description", content: "View and manage your shopping cart" },
  ];
};

export default function CartPage() {
  return <Cart />;
}
