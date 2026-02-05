import { Link } from "@remix-run/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-10">
          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Shop</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/collections/apparel" className="text-sm hover:text-white transition">Apparel</Link></li>
              <li><Link to="/collections/accessories" className="text-sm hover:text-white transition">Accessories</Link></li>
              <li><Link to="/collections/jewelry" className="text-sm hover:text-white transition">Jewelry</Link></li>
              <li><Link to="/collections/shoes" className="text-sm hover:text-white transition">Shoes</Link></li>
              <li><Link to="/collections/sale" className="text-sm hover:text-white transition">Sale</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Collections</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/collections/women" className="text-sm hover:text-white transition">Women</Link></li>
              <li><Link to="/collections/men" className="text-sm hover:text-white transition">Men</Link></li>
              <li><Link to="/collections/kids" className="text-sm hover:text-white transition">Kids</Link></li>
              <li><Link to="/collections/bestseller" className="text-sm hover:text-white transition">Bestsellers</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Customer Service</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/search" className="text-sm hover:text-white transition">Search</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-white transition">Shopping Cart</Link></li>
              <li><Link to="/account/login" className="text-sm hover:text-white transition">My Account</Link></li>
              <li><a href="#" className="text-sm hover:text-white transition">Contact Us</a></li>
              <li><a href="#" className="text-sm hover:text-white transition">Shipping & Returns</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">About Us</h3>
            <ul className="flex flex-col gap-2.5">
              <li><a href="#" className="text-sm hover:text-white transition">Our Story</a></li>
              <li><a href="#" className="text-sm hover:text-white transition">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-1 md:col-span-2">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">Newsletter</h3>
            <p className="text-sm">Subscribe to get special offers and updates</p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-gray-600"
                aria-label="Email for newsletter"
              />
              <button type="submit" className="px-5 py-2 bg-primary text-white rounded-md font-semibold text-sm hover:bg-primary-dark transition">
                Subscribe
              </button>
            </form>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">FB</a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">IG</a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 flex items-center justify-center bg-gray-800 rounded-full text-xs font-semibold hover:bg-primary hover:text-white transition">TW</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-800 gap-4">
          <p className="text-sm text-gray-500" suppressHydrationWarning>
            &copy; {currentYear} Shopify Storefront Demo. Built with Remix + TypeScript.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">We accept:</span>
            <span className="text-gray-400">💳 VISA • MC • AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
