interface Product {
  id: string | number;
  title: string;
  handle: string;
  featured_image?: string;
  price: number;
}

interface HeroProps {
  featuredProducts?: Product[];
}

export default function Hero({ featuredProducts = [] }: HeroProps) {
  // Use placeholder images if no products available
  const placeholderImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", // white t-shirt
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80", // leather bag
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", // sneakers
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", // sunglasses
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left side - Text content */}
          <div className="text-center lg:text-left">
            <h1 className="mb-6 text-3xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Evergreen Apparel Co
              </span>
            </h1>
            <p className="mb-8 max-w-2xl mx-auto text-base text-gray-700 sm:text-xl lg:mx-0">
              Discover timeless style and quality craftsmanship. From everyday essentials to statement pieces, 
              find everything you need to express your unique style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/products"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Shop All Products
              </a>
              <a
                href="/collections/sale"
                className="px-8 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 border border-gray-200"
              >
                View Sale Items
              </a>
            </div>
          </div>

          {/* Right side - Product showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 4).map((product, index) => (
                  <a
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                      index === 0 ? 'col-span-2 h-52 sm:h-64' : 'h-40 sm:h-48'
                    }`}
                  >
                    <img
                      src={product.featured_image || placeholderImages[index]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg mb-1">{product.title}</h3>
                        <p className="text-white/90 text-sm">
                          ${(product.price / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                // Fallback placeholder images
                placeholderImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-2xl shadow-lg ${
                      index === 0 ? 'col-span-2 h-52 sm:h-64' : 'h-40 sm:h-48'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Featured product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              )}
            </div>
            {/* Decorative badge */}
            <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 text-sm font-bold text-white shadow-lg sm:-right-4 sm:-top-4 sm:px-6 sm:text-base sm:rotate-12">
              New Arrivals
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-3">🚚</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600">On orders over $100</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-3">↩️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day hassle-free returns</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">Premium materials & craftsmanship</p>
          </div>
        </div>
      </div>
    </section>
  );
}
