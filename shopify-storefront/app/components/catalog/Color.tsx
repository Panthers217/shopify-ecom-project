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

interface ColorProps {
  variants: Variant[];
  options: ProductOption[];
  onColorChange?: (color: string | null) => void;
}

export default function Color({ variants, options, onColorChange }: ColorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Find the color option from product options (look for "Color" or "Colour" option)
  const colorOption = options.find(
    (opt) => opt.name.toLowerCase() === "color" || opt.name.toLowerCase() === "colour"
  );

  if (!colorOption) {
    return null;
  }

  // Extract unique colors from the color option values
  const colors = colorOption.values;

  const handleColorSelect = (color: string | null) => {
    setSelectedColor(color);
    onColorChange?.(color);
  };

  // Helper to check if a color is available in any variant
  const isColorAvailable = (color: string): boolean => {
    return variants.some((variant) => {
      const optionIndex = colorOption.position - 1; // position is 1-based
      const variantColor = [variant.option1, variant.option2, variant.option3][optionIndex];
      return variantColor === color && variant.available;
    });
  };

  // Color mapping for display
  const colorMap: { [key: string]: string } = {
    "light blue": "#ADD8E6",
    "light-blue": "#ADD8E6",
    "pink": "#FFC0CB",
    "lightblue": "#ADD8E6",
    "blue": "#0000FF",
    "white": "#FFFFFF",
    "black": "#000000",
  };

  return (
    <div className="flex gap-3">
      {colors.map((color) => {
        const isAvailable = isColorAvailable(color);
        const colorKey = String(color).toLowerCase();
        const bgColor = colorMap[colorKey] || color;

        return (
          // <button
          //   key={color}
          //   type="button"
          //   onClick={() =>  handleColorSelect(color)}
          //   // disabled={!isAvailable}
          //   title={color}
          //   className={`w-8 h-8 rounded-full border-2 transition-all ${
          //     selectedColor === color
          //       ? "border-gray-900"
          //       : "border-gray-300 hover:border-gray-500"
          //   } ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          //   style={{ backgroundColor: bgColor }}
          // />
          
          // demo  pupose, not disabling unavailable colors to show all options
           <button
            key={color}
            type="button"
            onClick={() =>  handleColorSelect(color)}
            // disabled={!isAvailable}
            title={color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color
                ? "border-gray-900"
                : "border-gray-300 hover:border-gray-500"
            } ${ "cursor-pointer"}`}
            style={{ backgroundColor: bgColor }}
          />
        );
      })}
    </div>
  );
}
