import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import Filter from "~/components/catalog/Filter";

export const meta: MetaFunction = () => {
  return [
    { title: "Search - Shopify Storefront" },
    { name: "description", content: "Search for products" },
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

  // TODO: Search products from Shopify Storefront API
  const products = [];
  
  return json({ products, searchQuery, filters });
}

export default function SearchPage() {
  const { products, searchQuery, filters } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) {
      setSearchParams({ q: query.toString() });
    }
  };

  return (
    <div className="container">
      <h1>Search</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          name="q"
          placeholder="Search products..."
          defaultValue={searchQuery}
          className="search-input"
        />
        <button type="submit">Search</button>
      </form>

      {searchQuery && (
        <p>Search results for: <strong>{searchQuery}</strong></p>
      )}

      <div className="search-layout">
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
