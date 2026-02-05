/**
 * Filter Utilities
 * Normalize and validate filter parameters from URL search params
 */

export interface ProductFilters {
  color?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  vendor?: string;
  tags?: string[];
  availability?: "in_stock" | "out_of_stock";
  sortBy?: "price_asc" | "price_desc" | "title_asc" | "title_desc" | "newest" | "bestselling";
}

/**
 * Normalize filter parameters from URL search params
 */
export function normalizeFilters(searchParams: URLSearchParams): ProductFilters {
  const filters: ProductFilters = {};

  // Color filter
  const color = searchParams.get("color");
  if (color) {
    filters.color = color.toLowerCase();
  }

  // Size filter
  const size = searchParams.get("size");
  if (size) {
    filters.size = size.toUpperCase();
  }

  // Price range filters
  const minPrice = searchParams.get("minPrice");
  if (minPrice) {
    const parsed = parseFloat(minPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.minPrice = Math.round(parsed * 100); // Convert to cents
    }
  }

  const maxPrice = searchParams.get("maxPrice");
  if (maxPrice) {
    const parsed = parseFloat(maxPrice);
    if (!isNaN(parsed) && parsed >= 0) {
      filters.maxPrice = Math.round(parsed * 100); // Convert to cents
    }
  }

  // Category filter
  const category = searchParams.get("category");
  if (category) {
    filters.category = category.toLowerCase();
  }

  // Vendor filter
  const vendor = searchParams.get("vendor");
  if (vendor) {
    filters.vendor = vendor;
  }

  // Tags filter (can be multiple)
  const tags = searchParams.getAll("tag");
  if (tags.length > 0) {
    filters.tags = tags;
  }

  // Availability filter
  const availability = searchParams.get("availability");
  if (availability === "in_stock" || availability === "out_of_stock") {
    filters.availability = availability;
  }

  // Sort by
  const sortBy = searchParams.get("sortBy");
  const validSortOptions = [
    "price_asc",
    "price_desc",
    "title_asc",
    "title_desc",
    "newest",
    "bestselling",
  ];
  if (sortBy && validSortOptions.includes(sortBy)) {
    filters.sortBy = sortBy as ProductFilters["sortBy"];
  }

  return filters;
}

/**
 * Build Shopify Storefront API query string from filters
 */
export function buildShopifyQuery(filters: ProductFilters): string {
  const conditions: string[] = [];

  // Availability
  if (filters.availability === "in_stock") {
    conditions.push("available:true");
  } else if (filters.availability === "out_of_stock") {
    conditions.push("available:false");
  }

  // Product type (category)
  if (filters.category) {
    conditions.push(`product_type:${filters.category}`);
  }

  // Vendor
  if (filters.vendor) {
    conditions.push(`vendor:${filters.vendor}`);
  }

  // Tags
  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => {
      conditions.push(`tag:${tag}`);
    });
  }

  // Price range - Shopify uses variant_price for filtering
  if (filters.minPrice !== undefined) {
    conditions.push(`variant_price:>=${filters.minPrice / 100}`);
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(`variant_price:<=${filters.maxPrice / 100}`);
  }

  return conditions.join(" AND ");
}

/**
 * Get sort key for Shopify API from sort option
 */
export function getSortKey(
  sortBy?: ProductFilters["sortBy"]
): { sortKey: string; reverse: boolean } {
  switch (sortBy) {
    case "price_asc":
      return { sortKey: "PRICE", reverse: false };
    case "price_desc":
      return { sortKey: "PRICE", reverse: true };
    case "title_asc":
      return { sortKey: "TITLE", reverse: false };
    case "title_desc":
      return { sortKey: "TITLE", reverse: true };
    case "newest":
      return { sortKey: "CREATED_AT", reverse: true };
    case "bestselling":
      return { sortKey: "BEST_SELLING", reverse: false };
    default:
      return { sortKey: "COLLECTION_DEFAULT", reverse: false };
  }
}

/**
 * Filter products client-side (for additional filters not supported by API)
 */
export function filterProducts<T extends {
  variants?: Array<{ option1?: string | null; option2?: string | null }>;
}>(
  products: T[],
  filters: ProductFilters
): T[] {
  let filtered = [...products];

  // Filter by color (usually option2)
  if (filters.color) {
    filtered = filtered.filter((product) =>
      product.variants?.some(
        (variant) =>
          variant.option2?.toLowerCase() === filters.color?.toLowerCase()
      )
    );
  }

  // Filter by size (usually option1)
  if (filters.size) {
    filtered = filtered.filter((product) =>
      product.variants?.some(
        (variant) =>
          variant.option1?.toUpperCase() === filters.size?.toUpperCase()
      )
    );
  }

  return filtered;
}
