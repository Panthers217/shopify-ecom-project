import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import Cards from "~/components/catalog/Cards";
import type { MappedProduct } from "~/lib/productMapper";

interface SearchResult {
  products: MappedProduct[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<MappedProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetcher = useFetcher<SearchResult>();
  const isLoading = fetcher.state !== "idle";

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length > 0) {
      searchTimeoutRef.current = setTimeout(() => {
        fetcher.load(`/api/search?q=${encodeURIComponent(query)}`);
      }, 300);
    } else {
      setResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, fetcher]);

  // Update results when fetcher data changes
  useEffect(() => {
    if (fetcher.data?.products) {
      setResults(fetcher.data.products);
    }
  }, [fetcher.data]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    if (isFocused) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFocused]);

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm focus-within:border-gray-500 focus-within:shadow-md transition-all">
          <svg
            className="w-5 h-5 text-gray-400 ml-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="flex-1 px-4 py-3 bg-white outline-none text-sm"
            autoComplete="off"
          />

          {query && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {isLoading && (
            <div className="px-3 py-2">
              <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isFocused && (query || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-[600px] overflow-y-auto">
          {isLoading && query && results.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin w-6 h-6 border-3 border-gray-300 border-t-gray-600 rounded-full mx-auto mb-2" />
                <p className="text-sm text-gray-500">Searching products...</p>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="p-6 relative">
              {isLoading && query && (
                <div className="absolute inset-x-6 top-2 z-10 flex justify-end">
                  <span className="text-xs text-gray-500 bg-white/90 px-2 py-1 rounded">
                    Updating...
                  </span>
                </div>
              )}
              <p className="text-xs text-gray-500 font-semibold uppercase mb-4">
                Search Results ({results.length})
              </p>
              <Cards products={results.slice(0, 12)} />
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <p className="text-gray-600 font-medium">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!query && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <svg
                className="w-12 h-12 text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h6m0 0h6"
                />
              </svg>
              <p className="text-gray-600 font-medium">Start typing to search</p>
              <p className="text-sm text-gray-500 mt-1">
                Find products by name, description, or category
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
