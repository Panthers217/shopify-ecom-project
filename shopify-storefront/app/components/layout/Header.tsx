import { Link } from "@remix-run/react";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center text-sm">
            <div>
              <span className="text-gray-600 font-medium">Free shipping on orders over $50</span>
            </div>
            <div className="flex gap-2 items-center">
              <Link to="/account/login" className="text-gray-600 font-medium px-2 py-1 rounded hover:text-primary hover:bg-blue-50 transition">
                Login
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/account/signup" className="text-gray-600 font-medium px-2 py-1 rounded hover:text-primary hover:bg-blue-50 transition">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 text-gray-900 font-bold text-xl hover:opacity-80 transition">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <rect width="32" height="32" rx="4" fill="currentColor"/>
                <path d="M10 12L16 18L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Storefront</span>
            </Link>
            
            <NavBar />
            
            <div className="flex gap-6 ml-auto items-center">
              <Link to="/search" className="flex items-center gap-2 text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2"/>
                  <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Search</span>
              </Link>
              
              <Link to="/cart" className="relative flex items-center gap-2 text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-primary transition" aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1h3l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L19 5H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="18" r="1" fill="currentColor"/>
                  <circle cx="16" cy="18" r="1" fill="currentColor"/>
                </svg>
                <span>Cart</span>
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">0</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
