interface Product {
  id: string | number;
  title: string;
  description: string;
  price: number;
  compare_at_price?: number;
  images: string[];
  media?: Array<{
    src: string;
    alt: string | null;
    media_type: string;
  }>;
}

interface CardOverviewProps {
  product: Product;
}

export default function CardOverview({ product }: CardOverviewProps) {
  const images = product.media?.map(m => ({ src: m.src, alt: m.alt })) || 
                 product.images?.map(src => ({ src, alt: product.title })) || [];

  return (
    <div className="card-overview">
      <div className="product-images">
        {images.length > 0 ? (
          <>
            <div className="main-image">
              <img src={images[0].src} alt={images[0].alt || product.title} />
            </div>
            {images.length > 1 && (
              <div className="thumbnail-images">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className="thumbnail"
                    onClick={() => {
                      // TODO: Implement image gallery switching
                    }}
                  >
                    <img src={img.src} alt={img.alt || `${product.title} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="no-image">No image available</div>
        )}
      </div>

      <div className="product-info">
        <h1>{product.title}</h1>
        
        <div className="product-price">
          {product.compare_at_price && product.compare_at_price > product.price ? (
            <>
              <span className="price-sale">${(product.price / 100).toFixed(2)}</span>
              <span className="price-original">${(product.compare_at_price / 100).toFixed(2)}</span>
            </>
          ) : (
            <span className="price">${(product.price / 100).toFixed(2)}</span>
          )}
        </div>

        <div
          className="product-description"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
