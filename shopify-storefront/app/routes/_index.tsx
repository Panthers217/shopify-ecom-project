import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewMerch from "~/components/catalog/NewMerch";
import Cards from "~/components/catalog/Cards";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopify Storefront - New Arrivals" },
    { name: "description", content: "Shop the latest arrivals and featured products" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Fetch new arrivals from Shopify Storefront API
  const newProducts = [];
  
  return json({ newProducts });
}

export default function Index() {
  const { newProducts } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>New Arrivals</h1>
      <NewMerch />
      <Cards products={newProducts} />
    </div>
  );
}
