import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import Filter from "~/components/catalog/Filter";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.collection?.title ? `${data.collection.title} - Shopify Storefront` : "Collection" },
    { name: "description", content: data?.collection?.description || "Browse our collection" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const url = new URL(request.url);
  
  const filters = {
    color: url.searchParams.get("color"),
    size: url.searchParams.get("size"),
    minPrice: url.searchParams.get("minPrice"),
    maxPrice: url.searchParams.get("maxPrice"),
  };

  if (!handle) {
    throw new Response("Not Found", { status: 404 });
  }

  // TODO: Fetch collection and products from Shopify Storefront API
  const collection = { title: handle, description: "" };
  const products = [];
  
  return json({ collection, products, filters });
}

export default function CollectionPage() {
  const { collection, products, filters } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h1>{collection.title}</h1>
      {collection.description && <p>{collection.description}</p>}
      
      <div className="collection-layout">
        <aside>
          <Filter currentFilters={filters} />
        </aside>
        <div className="products-grid">
          <Cards products={products} />
        </div>
      </div>
    </div>
  );
}
