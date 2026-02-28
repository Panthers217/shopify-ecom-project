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

interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

interface SizesProps {
  variants: Variant[];
  options: ProductOption[];
  onSizeChange?: (size: string | null) => void;
}

export default function Sizes({ variants, options, onSizeChange }: SizesProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Find the size option from product options (look for "Size" option)
  const sizeOption = options.find(
    (opt) => opt.name.toLowerCase() === "size"
  );

  if (!sizeOption) {
    return null;
  }

  // Extract unique sizes from the size option values
  const sizes = sizeOption.values;

  const handleSizeSelect = (size: string | null) => {
    setSelectedSize(size);
    onSizeChange?.(size);
  };

  // Helper to check if a size is available in any variant
  const isSizeAvailable = (size: string): boolean => {
    return variants.some((variant) => {
      const optionIndex = sizeOption.position - 1; // position is 1-based
      const variantSize = [variant.option1, variant.option2, variant.option3][optionIndex];
      return variantSize === size && variant.available;
    });
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {sizes.map((size) => {
        const isAvailable = isSizeAvailable(size);

        return (
          // <button
          //   key={size}
          //   type="button"
          //   onClick={() => isAvailable && handleSizeSelect(size)}
          //   disabled={!isAvailable}
          //   className={`px-4 py-2 border-2 rounded font-medium text-sm transition-all ${
          //     selectedSize === size
          //       ? "border-gray-900 bg-gray-900 text-white"
          //       : "border-gray-300 bg-white text-gray-900 hover:border-gray-500"
          //   } ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          // >
          //   {size}
          // </button>
          
          // demo  pupose, not disabling unavailable sizes to show all options
           <button
            key={size}
            type="button"
            onClick={() => handleSizeSelect(size)}
            className={`px-4 py-2 border-2 rounded font-medium text-sm transition-all ${
              selectedSize === size
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-300 bg-white text-gray-900 hover:border-gray-500"
            } ${ "cursor-pointer"}`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
