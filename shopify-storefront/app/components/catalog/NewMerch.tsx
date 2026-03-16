import Cards from "./Cards";
import type { MappedProduct } from "~/lib/productMapper";

interface NewMerchProps {
  products: MappedProduct[];
  title?: string;
  description?: string;
}

export default function NewMerch({ 
  products, 
  title = "New Arrivals",
  description = "Check out our latest merchandise" 
}: NewMerchProps) {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3 md:text-4xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            {description}
          </p>
        </div>
        
        <Cards products={products} />
        
        {products.length > 0 && (
          <div className="text-center mt-10">
            <a
              href="/products"
              className="inline-block px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              View All Products
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
