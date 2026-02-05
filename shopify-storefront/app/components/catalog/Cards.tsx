import { Link } from "@remix-run/react";
import type { MappedProduct } from "~/lib/productMapper";

interface CardsProps {
  products: MappedProduct[];
}

export default function Cards({ products }: CardsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

interface ProductCardProps {
  product: MappedProduct;
}

function ProductCard({ product }: ProductCardProps) {
  const isOnSale = product.compare_at_price > 0 && product.compare_at_price > product.price;
  const discount = isOnSale
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  const priceDisplay = (product.price / 100).toFixed(2);
  const compareAtDisplay = (product.compare_at_price / 100).toFixed(2);
  const image = product.media?.[0];

  return (
    <Link
      to={`/products/${product.handle}`}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              SALE {discount}%
            </span>
          </div>
        )}
        {image ? (
          <img
            src={image.src}
            alt={image.alt || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        {product.vendor && (
          <p className="text-xs text-gray-500 mb-2">{product.vendor}</p>
        )}
        
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">${priceDisplay}</span>
          {isOnSale && (
            <span className="text-sm text-gray-500 line-through">${compareAtDisplay}</span>
          )}
        </div>
        
        {product.price_varies && (
          <p className="text-xs text-gray-500 mt-1">Starting at</p>
        )}
        
        {product.available === false && (
          <div className="mt-2">
            <span className="inline-block bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded">
              Sold Out
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
