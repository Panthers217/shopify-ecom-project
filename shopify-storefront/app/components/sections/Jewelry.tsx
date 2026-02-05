import { Link } from "@remix-run/react";

export default function Jewelry() {
  return (
    <section className="jewelry-section">
      <div className="section-header">
        <h2>Jewelry</h2>
        <p>Elegant pieces to elevate any outfit</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/jewelry?category=necklaces" className="category-card">
          <h3>Necklaces</h3>
        </Link>
        <Link to="/collections/jewelry?category=earrings" className="category-card">
          <h3>Earrings</h3>
        </Link>
        <Link to="/collections/jewelry?category=bracelets" className="category-card">
          <h3>Bracelets</h3>
        </Link>
        <Link to="/collections/jewelry?category=rings" className="category-card">
          <h3>Rings</h3>
        </Link>
      </div>
    </section>
  );
}
