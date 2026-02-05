import type { MappedProduct } from "~/lib/productMapper";

interface CardOverviewProps {
  product: MappedProduct;
  className?: string;
}

export default function CardOverview({ product, className = "" }: CardOverviewProps) {
  const isOnSale = product.compare_at_price > 0 && product.compare_at_price > product.price;
  const discount = isOnSale
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const image = product.media?.[0];

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        {image && (
          <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={image.src}
              alt={image.alt || product.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base mb-1">
            {product.title}
          </h3>
          
          {product.vendor && (
            <p className="text-sm text-gray-500 mb-2">{product.vendor}</p>
          )}
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-gray-900">
              ${(product.price / 100).toFixed(2)}
            </span>
            
            {isOnSale && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ${(product.compare_at_price / 100).toFixed(2)}
                </span>
                <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          
          {product.available === false && (
            <span className="inline-block mt-2 text-sm text-gray-600 font-medium">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
