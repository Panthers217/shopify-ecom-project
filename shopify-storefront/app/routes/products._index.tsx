import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_PRODUCTS_QUERY } from "~/lib/queries";
import { mapProducts } from "~/lib/productMapper";

export const meta: MetaFunction = () => {
  return [
    { title: "All Products - Shopify Storefront" },
    { name: "description", content: "Browse all products with search and filter options" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  const sortKey = url.searchParams.get("sort") || "TITLE";
  const reverse = url.searchParams.get("reverse") === "true";

  try {
    const { products } = await storefrontFetch<{
      products: { edges: Array<{ node: any }> };
    }>(GET_PRODUCTS_QUERY, {
      first: 20,
      sortKey: sortKey.toUpperCase(),
      reverse,
      query: searchQuery || null,
    });

    const productNodes = products.edges.map((edge: any) => edge.node);
    const mappedProducts = mapProducts(productNodes);

    return json({ products: mappedProducts, searchQuery });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ products: [], searchQuery });
  }
}

export default function ProductsIndex() {
  const { products, searchQuery } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
        {searchQuery && (
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
          </p>
        )}
        <p className="text-gray-600">{products.length} products</p>
      </div>

      <div className="flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchParams.get("sort") || "TITLE"}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                params.set("sort", e.target.value);
                window.location.search = params.toString();
              }}
            >
              <option value="TITLE">Title (A-Z)</option>
              <option value="PRICE">Price (Low to High)</option>
              <option value="CREATED_AT">Newest First</option>
              <option value="BEST_SELLING">Best Selling</option>
            </select>
          </div>
        </aside>

        <div className="flex-1">
          <Cards products={products} />
        </div>
      </div>
    </div>
  );
}
