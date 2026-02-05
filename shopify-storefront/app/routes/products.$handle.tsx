import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CardOverview from "~/components/catalog/CardOverview";
import Sizes from "~/components/catalog/Sizes";
import Color from "~/components/catalog/Color";

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

  // TODO: Fetch product by handle from Shopify Storefront API
  const product = null;
  
  if (!product) {
    throw new Response("Product Not Found", { status: 404 });
  }
  
  return json({ product });
}

export default function ProductDetail() {
  const { product } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <div className="product-detail">
        <CardOverview product={product} />
        <div className="product-options">
          <Sizes variants={product?.variants || []} />
          <Color variants={product?.variants || []} />
          <button type="button" className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
