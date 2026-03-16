import { Link } from "@remix-run/react";
import Newsletter from "~/components/layout/Newsletter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
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
              <li><Link to="/pages/contact" className="text-sm hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/pages/shipping-returns" className="text-sm hover:text-white transition">Shipping & Returns</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-gray-100 uppercase tracking-wide">About Us</h3>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/pages/about" className="text-sm hover:text-white transition">Our Story</Link></li>
              <li><Link to="/pages/careers" className="text-sm hover:text-white transition">Careers</Link></li>
              <li><Link to="/pages/privacy-policy" className="text-sm hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/pages/terms-of-service" className="text-sm hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

          <Newsletter />
        </div>

        <div className="flex flex-col gap-4 border-t border-gray-800 pt-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-sm text-gray-500" suppressHydrationWarning>
            &copy; {currentYear} Shopify Storefront Demo. Built with Remix + TypeScript.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm md:justify-end">
            <span className="text-gray-500">We accept:</span>
            <span className="text-gray-400">💳 VISA • MC • AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
