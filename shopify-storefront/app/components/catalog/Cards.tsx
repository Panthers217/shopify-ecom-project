import { Link } from "@remix-run/react";

interface Product {
  id: string | number;
  title: string;
  handle: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  available: boolean;
}

interface CardsProps {
  products: Product[];
}

export default function Cards({ products }: CardsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-cards grid">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/products/${product.handle}`}
          className="product-card"
        >
          <div className="product-card-image">
            <img
              src={product.featured_image}
              alt={product.title}
              loading="lazy"
            />
          </div>
          <div className="product-card-info">
            <h3>{product.title}</h3>
            <div className="product-card-price">
              {product.compare_at_price && product.compare_at_price > product.price ? (
                <>
                  <span className="price-sale">${(product.price / 100).toFixed(2)}</span>
                  <span className="price-original">${(product.compare_at_price / 100).toFixed(2)}</span>
                </>
              ) : (
                <span className="price">${(product.price / 100).toFixed(2)}</span>
              )}
            </div>
            {!product.available && (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
