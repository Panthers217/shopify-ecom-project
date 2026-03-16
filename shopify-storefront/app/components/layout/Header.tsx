import { useEffect, useState } from "react";
import { Link, Form } from "@remix-run/react";
import NavBar from "./NavBar";
import { useCart } from "~/hooks/useCart";

interface Customer {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

interface HeaderProps {
  customer?: Customer | null;
}

export default function Header({ customer }: HeaderProps) {
  const { cart, totalPrice, } = useCart();
  const [cachedTotalPrice, setCachedTotalPrice] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist totalPrice to localStorage
  useEffect(() => {
    setCachedTotalPrice(totalPrice);
    if (typeof window !== "undefined") {
      localStorage.setItem("cart-total-price", String(totalPrice));
    }
  }, [totalPrice]);

  // Initialize cached price from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedPrice = localStorage.getItem("cart-total-price");
      if (cachedPrice) {
        setCachedTotalPrice(Number(cachedPrice));
      }
    }
  }, []);
 
  // Directly use cart.itemCount for badge - no intermediate state needed
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="bg-gray-50 border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <span className="text-gray-600 font-medium">Free shipping on orders over $50</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
              {customer ? (
                <>
                  <Link 
                    to="/account" 
                    className="flex items-center gap-2 rounded px-3 py-1 text-gray-600 font-medium transition hover:bg-blue-50 hover:text-primary"
                  >
                    <span className="text-lg">👤</span>
                    <span className="truncate">Hi, {customer.firstName || "Customer"}</span>
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Form method="post" action="/account/logout" className="inline">
                    <button
                      type="submit"
                      className="text-gray-600 font-medium px-3 py-1 rounded hover:text-red-600 hover:bg-red-50 transition"
                    >
                      Sign Out
                    </button>
                  </Form>
                </>
              ) : (
                <>
                  <Link to="/account/login" className="text-gray-600 font-medium px-2 py-1 rounded hover:text-primary hover:bg-blue-50 transition">
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/account/signup" className="text-gray-600 font-medium px-2 py-1 rounded hover:text-primary hover:bg-blue-50 transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-3 text-gray-900 font-bold text-xl hover:opacity-80 transition">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <rect width="32" height="32" rx="4" fill="currentColor"/>
                <path d="M10 12L16 18L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="hidden sm:inline">Storefront</span>
            </Link>
            
            {/* <NavBar /> */}
            
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 transition hover:bg-gray-50 md:hidden"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              <Link to="/cart" className="relative flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50 hover:text-primary" aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1h3l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L19 5H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="18" r="1" fill="currentColor"/>
                  <circle cx="16" cy="18" r="1" fill="currentColor"/>
                </svg>
                <span className="hidden sm:inline">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{itemCount}</span>
                )}
              </Link>
            </div>
          </div>

          <NavBar mobileOpen={isMobileMenuOpen} onNavigate={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>
    </header>
  );
}
