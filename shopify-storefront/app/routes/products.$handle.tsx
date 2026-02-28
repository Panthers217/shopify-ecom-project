import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CardOverview from "~/components/catalog/CardOverview";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCT_BY_HANDLE_QUERY } from "~/lib/queries";
import { mapProduct } from "~/lib/productMapper";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.product?.title ? `${data.product.title} - Shopify Storefront` : "Product" },
    { name: "description", content: data?.product?.description || "Product details" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const { handle } = params;
  
  if (!handle) {
    throw new Response("Not Found", { status: 404 });
  }

  try {
    const data = await storefrontFetch<{
      product: any;
    }>(GET_PRODUCT_BY_HANDLE_QUERY, {
      handle,
    });

    if (!data.product) {
      throw new Response("Product Not Found", { status: 404 });
    }
    
    // Use the mapProduct function to properly transform the data
    const product = mapProduct(data.product);
    
    return json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Response("Product Not Found", { status: 404 });
  }
}

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      <CardOverview product={product} />
    </div>
  );
}
