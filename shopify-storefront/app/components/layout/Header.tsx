import { Link } from "@remix-run/react";
import NavBar from "./NavBar";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Shopify Storefront</h1>
          </Link>
          
          <NavBar />
          
          <div className="header-actions">
            <Link to="/search" className="search-link">
              Search
            </Link>
            <Link to="/account/login" className="account-link">
              Account
            </Link>
            <Link to="/cart" className="cart-link">
              Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
