import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { storefrontFetch } from "~/lib/shopifyStorefront.server";
import { mapProduct } from "~/lib/productMapper";

interface SearchProductsResponse {
  products: {
    edges: Array<{
      node: any;
    }>;
    pageInfo: {
      hasNextPage: boolean;
    };
  };
}

const SEARCH_PRODUCTS_QUERY = `
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    tags
    createdAt
    updatedAt
    publishedAt
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    images(first: 20) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            id
            url
            altText
            width
            height
          }
          sku
          barcode
          weight
          weightUnit
          requiresShipping
          taxable
        }
      }
    }
    options {
      id
      name
      values
    }
  }

  query SearchProducts($query: String!, $first: Int = 20) {
    products(first: $first, query: $query) {
      edges {
        node {
          ...ProductFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

export async function loader({ request }: LoaderFunctionArgs) {
  // Only accept GET requests
  if (request.method !== "GET") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  // Get search query from URL params
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q") || "";

  // Validate query length
  if (searchQuery.trim().length === 0) {
    return json({ products: [] });
  }

  if (searchQuery.length > 100) {
    return json(
      { error: "Search query too long" },
      { status: 400 }
    );
  }

  try {
    // Query Shopify Storefront API
    const response = await storefrontFetch<SearchProductsResponse>(
      SEARCH_PRODUCTS_QUERY,
      {
        query: searchQuery,
        first: 20,
      }
    );

    if (!response?.products?.edges) {
      return json({ products: [] });
    }

    // Map products to our format
    const mappedProducts = response.products.edges.map(
      (edge: { node: any }) => mapProduct(edge.node)
    );

    return json(
      { products: mappedProducts },
      {
        headers: {
          "Cache-Control": "public, max-age=60",
        },
      }
    );
  } catch (error) {
    console.error("Search endpoint error:", error);
    return json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
