import { Form, useSearchParams } from "@remix-run/react";

interface FilterProps {
  currentFilters: {
    color?: string | null;
    size?: string | null;
    minPrice?: string | null;
    maxPrice?: string | null;
  };
}

export default function Filter({ currentFilters }: FilterProps) {
  const [searchParams] = useSearchParams();

  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const categories = ["Apparel", "Accessories", "Jewelry", "Shoes"];

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      <Form method="get" className="filter-form">
        {/* Preserve search query if it exists */}
        {searchParams.get("q") && (
          <input type="hidden" name="q" value={searchParams.get("q") || ""} />
        )}

        {/* Color Filter */}
        <div className="filter-section">
          <h4>Color</h4>
          <div className="filter-options">
            {colors.map((color) => (
              <label key={color} className="filter-option">
                <input
                  type="checkbox"
                  name="color"
                  value={color.toLowerCase()}
                  defaultChecked={currentFilters.color === color.toLowerCase()}
                />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Size Filter */}
        <div className="filter-section">
          <h4>Size</h4>
          <div className="filter-options">
            {sizes.map((size) => (
              <label key={size} className="filter-option">
                <input
                  type="checkbox"
                  name="size"
                  value={size}
                  defaultChecked={currentFilters.size === size}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              defaultValue={currentFilters.minPrice || ""}
              min="0"
              step="1"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              defaultValue={currentFilters.maxPrice || ""}
              min="0"
              step="1"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
          <h4>Categories</h4>
          <div className="filter-options">
            {categories.map((category) => (
              <label key={category} className="filter-option">
                <input type="checkbox" name="category" value={category.toLowerCase()} />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="apply-filters-btn">
            Apply Filters
          </button>
          <button type="reset" className="clear-filters-btn">
            Clear All
          </button>
        </div>
      </Form>
    </div>
  );
}
