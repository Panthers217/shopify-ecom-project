import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewMerch from "~/components/catalog/NewMerch";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCTS_QUERY } from "~/lib/queries";
import { mapProducts } from "~/lib/productMapper";

export const meta: MetaFunction = () => {
  return [
    { title: "Shopify Storefront - New Arrivals" },
    { name: "description", content: "Shop the latest arrivals and featured products" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Fetch latest products from Shopify (sorted by created date, descending)
    const { products } = await storefrontFetch<{
      products: { edges: Array<{ node: any }> };
    }>(GET_PRODUCTS_QUERY, {
      first: 8,
      sortKey: "CREATED_AT",
      reverse: true,
    });

    const newProducts = mapProducts(products.edges);

    return json({ newProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ newProducts: [] });
  }
}

export default function Index() {
  const { newProducts } = useLoaderData<typeof loader>();

  return (
    <div>
      <NewMerch
        products={newProducts}
        title="New Arrivals"
        description="Discover our latest collection of fashion-forward pieces"
      />
    </div>
  );
}
