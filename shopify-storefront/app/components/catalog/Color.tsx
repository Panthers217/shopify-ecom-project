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

interface ColorProps {
  variants: Variant[];
}

export default function Color({ variants }: ColorProps) {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Extract unique colors from variants (assuming color is option2 or in title)
  const colors = Array.from(
    new Set(
      variants.map((v) => v.option2 || v.title).filter(Boolean)
    )
  );

  if (colors.length === 0) {
    return null;
  }

  return (
    <div className="color-selector">
      <h4>Select Color</h4>
      <div className="color-options">
        {colors.map((color) => {
          const variant = variants.find(
            (v) => v.option2 === color || v.title === color
          );
          const isAvailable = variant?.available ?? false;

          return (
            <button
              key={color}
              type="button"
              className={`color-option ${selectedColor === color ? "active" : ""} ${
                !isAvailable ? "out-of-stock" : ""
              }`}
              onClick={() => isAvailable && setSelectedColor(color)}
              disabled={!isAvailable}
              title={color}
            >
              <span className="color-swatch" style={{ backgroundColor: color.toLowerCase() }}>
                {color}
              </span>
            </button>
          );
        })}
      </div>
      {selectedColor && (
        <p className="selected-color">Selected: {selectedColor}</p>
      )}
    </div>
  );
}
