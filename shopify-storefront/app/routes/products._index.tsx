import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import Filter from "~/components/catalog/Filter";

export const meta: MetaFunction = () => {
  return [
    { title: "All Products - Shopify Storefront" },
    { name: "description", content: "Browse all products with search and filter options" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";
  const filters = {
    color: url.searchParams.get("color"),
    size: url.searchParams.get("size"),
    minPrice: url.searchParams.get("minPrice"),
    maxPrice: url.searchParams.get("maxPrice"),
  };

  // TODO: Fetch products from Shopify Storefront API with filters
  const products = [];
  
  return json({ products, searchQuery, filters });
}

export default function ProductsIndex() {
  const { products, searchQuery, filters } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <div className="container">
      <h1>All Products</h1>
      <div className="products-layout">
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
