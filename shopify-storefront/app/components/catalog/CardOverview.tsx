import { useEffect, useMemo, useState } from "react";
import type { MappedProduct } from "~/lib/productMapper";
import { useCart } from "~/hooks/useCart";
import Sizes from "./Sizes";
import Color from "./Color";

interface CardOverviewProps {
  product: MappedProduct;
  className?: string;
}

export default function CardOverview({ product, className = "" }: CardOverviewProps) {
  // Cart management
  const { addToCart, loading: cartLoading, error: cartError } = useCart();

  // Component state
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [displayPrice, setDisplayPrice] = useState(product.price);
  const [displayCompareAtPrice, setDisplayCompareAtPrice] = useState(product.compare_at_price);
  const [activeImageSrc, setActiveImageSrc] = useState<string | null>(product.media?.[0]?.src || null);
  const [activeImageAlt, setActiveImageAlt] = useState<string | null>(product.media?.[0]?.alt || null);
  const [expandedSections, setExpandedSections] = useState<{
    details: boolean;
    sizing: boolean;
    returns: boolean;
  }>({
    details: false,
    sizing: false,
    returns: false,
  });
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const colorOption = product.options?.find(
    (option) => option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour"
  );
  const sizeOption = product.options?.find((option) => option.name.toLowerCase() === "size");

  const selectedVariant = useMemo(() => {
    if (!product.variants?.length) {
      return null;
    }

    const getVariantOptionValue = (
      variant: MappedProduct["variants"][number],
      position: number | undefined
    ): string | null => {
      if (!position) {
        return null;
      }

      return [variant.option1, variant.option2, variant.option3][position - 1] || null;
    };

    return (
      product.variants.find((variant) => {
        const variantColor = getVariantOptionValue(variant, colorOption?.position);
        const variantSize = getVariantOptionValue(variant, sizeOption?.position);

        const colorMatches = selectedColor ? variantColor === selectedColor : true;
        const sizeMatches = selectedSize ? variantSize === selectedSize : true;

        return colorMatches && sizeMatches;
      }) || product.variants[0]
    );
  }, [product.variants, colorOption?.position, sizeOption?.position, selectedColor, selectedSize]);

  useEffect(() => {
    if (!selectedVariant) {
      setDisplayPrice(product.price);
      setDisplayCompareAtPrice(product.compare_at_price);
      setActiveImageSrc(product.media?.[0]?.src || null);
      setActiveImageAlt(product.media?.[0]?.alt || null);
      return;
    }

    setDisplayPrice(selectedVariant.price || product.price);
    setDisplayCompareAtPrice(selectedVariant.compare_at_price || 0);

    if (selectedVariant.featured_image?.src) {
      setActiveImageSrc(selectedVariant.featured_image.src);
      setActiveImageAlt(selectedVariant.featured_image.alt || product.title);
    } else {
      setActiveImageSrc(product.media?.[0]?.src || null);
      setActiveImageAlt(product.media?.[0]?.alt || product.title);
    }
  }, [selectedVariant, product.price, product.compare_at_price, product.media, product.title]);

  const isOnSale = displayCompareAtPrice > 0 && displayCompareAtPrice > displayPrice;
  const discount = isOnSale
    ? Math.round(((displayCompareAtPrice - displayPrice) / displayCompareAtPrice) * 100)
    : 0;

  const images = product.media || [];
  const mainImage =
    images.find((image) => image.src === activeImageSrc) ||
    (activeImageSrc ? { src: activeImageSrc, alt: activeImageAlt } : images[0]);
  const selectedVariantAvailable = selectedVariant?.available ?? product.available;

  const toggleSection = (section: "details" | "sizing" | "returns") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setFeedbackMessage({ type: "error", text: "Please select variant options" });
      return;
    }

    const success = await addToCart(String(selectedVariant.id), 1);
    
    if (success) {
      setFeedbackMessage({ type: "success", text: "Added to cart!" });
      // Clear message after 3 seconds
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage({ 
        type: "error", 
        text: cartError || "Failed to add to cart" 
      });
    }
  };

  // Clear feedback when cart error changes
  useEffect(() => {
    if (cartError) {
      setFeedbackMessage({ type: "error", text: cartError });
    }
  }, [cartError]);

  return (
    <div className={`bg-white ${className}`}>
      <div className="grid grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-8">
        {/* Left: Product Gallery */}
        <div className="flex flex-col gap-4">
          {mainImage && (
            <div className="flex h-72 w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100 sm:h-96 md:h-full">
              <img
                src={mainImage.src}
                  alt={mainImage.alt || activeImageAlt || product.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={index}
                  className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-gray-100 transition-colors sm:h-16 sm:w-16 ${
                    activeImageSrc === image.src
                      ? "border-gray-800"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  type="button"
                  onClick={() => {
                    setActiveImageSrc(image.src);
                    setActiveImageAlt(image.alt || product.title);
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt || `${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-6">
          {/* Title and Rating */}
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.title}
            </h1>
            
            {product.vendor && (
              <p className="text-sm text-gray-600">{product.vendor}</p>
            )}
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">(0 reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              ${(displayPrice / 100).toFixed(2)}
            </span>
            
            {isOnSale && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ${(displayCompareAtPrice / 100).toFixed(2)}
                </span>
                <span className="inline-block bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Color Selector */}
          <div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                COLOR: {selectedColor?.toUpperCase() || colorOption?.values?.[0]?.toUpperCase() || "N/A"}
              </p>
              <Color 
                variants={product.variants || []} 
                options={product.options || []}
                onColorChange={setSelectedColor} 
              />
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-900 mb-2">SIZE</p>
              <Sizes 
                variants={product.variants || []} 
                options={product.options || []}
                onSizeChange={setSelectedSize} 
              />
              <button className="text-xs text-gray-600 mt-2 underline">Size Chart</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          {/* <button
            type="button"
            disabled={!selectedVariantAvailable || cartLoading}
            onClick={handleAddToCart}
            className="w-full bg-pink-100 hover:bg-pink-200 disabled:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded transition-colors"
          >
            {cartLoading ? "ADDING..." : "ADD TO CART"}
          </button> */}

          {/* demo purpose, not disabling add to cart to show feedback messages */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-pink-100 hover:bg-pink-200 disabled:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded transition-colors"
          >
            {cartLoading ? "ADDING..." : "ADD TO CART"}
          </button>

          {/* Feedback Message */}
          {feedbackMessage && (
            <div className={`p-3 rounded text-sm font-medium text-center ${
              feedbackMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {feedbackMessage.text}
            </div>
          )}

          {/* Wishlist and Share */}
          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:gap-4">
            <button type="button" className="flex-1 rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
              🤍 + Wishlist
            </button>
            <button type="button" className="flex-1 rounded border border-gray-300 px-4 py-2 hover:bg-gray-50">
              Share
            </button>
          </div>

          {/* Stock Status */}
          {!selectedVariantAvailable && (
            <div className="text-sm text-red-600 font-medium">
              Out of Stock
            </div>
          )}

          <hr className="my-2" />

          {/* Expandable Sections */}
          <div className="space-y-2">
            {/* Details & Materials */}
            <button
              onClick={() => toggleSection("details")}
              type="button"
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded text-left"
            >
              <span className="font-semibold text-gray-900 uppercase text-sm">Details & Materials</span>
              <span className={`transform transition-transform ${expandedSections.details ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {expandedSections.details && (
              <div className="px-4 pb-4 text-sm text-gray-700">
                <p className="mb-3">{product.description || "No description available"}</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>100% Polyester</li>
                  <li>Hand Wash Cold</li>
                  <li>Imported</li>
                </ul>
              </div>
            )}

            {/* Sizing */}
            <button
              onClick={() => toggleSection("sizing")}
              type="button"
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded text-left"
            >
              <span className="font-semibold text-gray-900 uppercase text-sm">Sizing</span>
              <span className={`transform transition-transform ${expandedSections.sizing ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {expandedSections.sizing && (
              <div className="px-4 pb-4 text-sm text-gray-700">
                <p>Model is 5'7" and wearing a size small.</p>
              </div>
            )}

            {/* Returns Policy */}
            <button
              onClick={() => toggleSection("returns")}
              type="button"
              className="w-full flex justify-between items-center py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded text-left"
            >
              <span className="font-semibold text-gray-900 uppercase text-sm">Returns Policy</span>
              <span className={`transform transition-transform ${expandedSections.returns ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            {expandedSections.returns && (
              <div className="px-4 pb-4 text-sm text-gray-700">
                <p>Items can be returned within 30 days of purchase in original, unworn condition.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
