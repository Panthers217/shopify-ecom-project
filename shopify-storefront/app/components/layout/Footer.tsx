import { Link } from "@remix-run/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Shop</h3>
            <ul>
              <li><Link to="/collections/apparel">Apparel</Link></li>
              <li><Link to="/collections/accessories">Accessories</Link></li>
              <li><Link to="/collections/jewelry">Jewelry</Link></li>
              <li><Link to="/collections/shoes">Shoes</Link></li>
              <li><Link to="/collections/sale">Sale</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/collections/women">Women</Link></li>
              <li><Link to="/collections/men">Men</Link></li>
              <li><Link to="/collections/kids">Kids</Link></li>
              <li><Link to="/collections/bestseller">Bestsellers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li><Link to="/account/login">Login</Link></li>
              <li><Link to="/account/signup">Sign Up</Link></li>
              <li><Link to="/cart">Cart</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <p>Email: support@example.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Shopify Storefront. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
