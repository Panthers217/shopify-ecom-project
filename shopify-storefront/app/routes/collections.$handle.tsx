import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { GET_COLLECTION_BY_HANDLE_QUERY } from "~/lib/queries";
import { mapProducts } from "~/lib/productMapper";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data || !data.collection) {
    return [
      { title: "Collection Not Found" },
      { name: "description", content: "The requested collection could not be found" },
    ];
  }

  return [
    { title: `${data.collection.title} - Shopify Storefront` },
    {
      name: "description",
      content: data.collection.description || `Shop ${data.collection.title} collection`,
    },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { handle } = params;

  if (!handle) {
    throw new Response("Collection handle is required", { status: 400 });
  }

  try {
    const data = await storefrontFetch<{
      collection: {
        id: string;
        title: string;
        description: string;
        products: { edges: Array<{ node: any }> };
      };
    }>(GET_COLLECTION_BY_HANDLE_QUERY, {
      handle,
      first: 20,
    });

    if (!data.collection) {
      // Collection doesn't exist yet - return friendly fallback
      const collectionTitles: Record<string, { title: string; description: string }> = {
        apparel: { title: "Apparel", description: "Explore our latest clothing collection" },
        accessories: { title: "Accessories", description: "Complete your look with perfect accessories" },
        jewelry: { title: "Jewelry", description: "Elegant pieces for every occasion" },
        shoes: { title: "Shoes", description: "Step up your style game" },
        sale: { title: "Sale", description: "Amazing deals you don't want to miss" },
        women: { title: "Women", description: "Fashion for her" },
        men: { title: "Men", description: "Fashion for him" },
        kids: { title: "Kids", description: "Fun styles for children" },
        bestseller: { title: "Bestseller", description: "Our most popular items" },
      };
      
      const collectionInfo = collectionTitles[handle] || { 
        title: handle.charAt(0).toUpperCase() + handle.slice(1), 
        description: `Browse our ${handle} collection` 
      };
      
      return json({
        collection: collectionInfo,
        products: [],
        notFound: true,
      });
    }

    const productNodes = data.collection.products.edges.map((edge: any) => edge.node);
    const products = mapProducts(productNodes);

    return json({
      collection: {
        title: data.collection.title,
        description: data.collection.description,
      },
      products,
      notFound: false,
    });
  } catch (error) {
    console.error("Error fetching collection:", error);
    
    // Return friendly fallback instead of 500 error
    const collectionTitles: Record<string, { title: string; description: string }> = {
      apparel: { title: "Apparel", description: "Explore our latest clothing collection" },
      accessories: { title: "Accessories", description: "Complete your look with perfect accessories" },
      jewelry: { title: "Jewelry", description: "Elegant pieces for every occasion" },
      shoes: { title: "Shoes", description: "Step up your style game" },
      sale: { title: "Sale", description: "Amazing deals you don't want to miss" },
      women: { title: "Women", description: "Fashion for her" },
      men: { title: "Men", description: "Fashion for him" },
      kids: { title: "Kids", description: "Fun styles for children" },
      bestseller: { title: "Bestseller", description: "Our most popular items" },
    };
    
    const collectionInfo = collectionTitles[handle] || { 
      title: handle.charAt(0).toUpperCase() + handle.slice(1), 
      description: `Browse our ${handle} collection` 
    };
    
    return json({
      collection: collectionInfo,
      products: [],
      error: true,
    });
  }
}

export default function CollectionPage() {
  const data = useLoaderData<typeof loader>();
  const { collection, products } = data;
  const notFound = 'notFound' in data && data.notFound;
  const error = 'error' in data && data.error;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{collection.title}</h1>
        {collection.description && (
          <p className="text-lg text-gray-600 max-w-3xl">{collection.description}</p>
        )}
        {(notFound || error) && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              <strong>Note:</strong> This collection hasn't been created in your Shopify store yet. 
              {' '}Create a collection with the handle "{collection.title.toLowerCase()}" in your Shopify admin to see products here.
            </p>
          </div>
        )}
        {!notFound && !error && (
          <p className="text-gray-600 mt-4">{products.length} products</p>
        )}
      </div>

      {products.length > 0 ? (
        <Cards products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this collection.</p>
        </div>
      )}
    </div>
  );
}
