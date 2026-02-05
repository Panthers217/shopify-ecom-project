import { useState } from "react";

interface Variant {
  id: string | number;
  title: string;
  option1?: string | null;
  option2?: string | null;
  option3?: string | null;
  available: boolean;
  price: number;
}

interface SizesProps {
  variants: Variant[];
}

export default function Sizes({ variants }: SizesProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Extract unique sizes from variants
  const sizes = Array.from(
    new Set(
      variants.map((v) => v.option1 || v.title).filter(Boolean)
    )
  );

  if (sizes.length === 0) {
    return null;
  }

  return (
    <div className="sizes-selector">
      <h4>Select Size</h4>
      <div className="size-options">
        {sizes.map((size) => {
          const variant = variants.find(
            (v) => v.option1 === size || v.title === size
          );
          const isAvailable = variant?.available ?? false;

          return (
            <button
              key={size}
              type="button"
              className={`size-option ${selectedSize === size ? "active" : ""} ${
                !isAvailable ? "out-of-stock" : ""
              }`}
              onClick={() => isAvailable && setSelectedSize(size)}
              disabled={!isAvailable}
            >
              {size}
            </button>
          );
        })}
      </div>
      {selectedSize && (
        <p className="selected-size">Selected: {selectedSize}</p>
      )}
    </div>
  );
}
