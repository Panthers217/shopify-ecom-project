import { Link } from "@remix-run/react";

export default function Accessories() {
  return (
    <section className="accessories-section">
      <div className="section-header">
        <h2>Accessories</h2>
        <p>Complete your look with our accessories</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/accessories?category=bags" className="category-card">
          <h3>Bags</h3>
        </Link>
        <Link to="/collections/accessories?category=hats" className="category-card">
          <h3>Hats</h3>
        </Link>
        <Link to="/collections/accessories?category=scarves" className="category-card">
          <h3>Scarves</h3>
        </Link>
        <Link to="/collections/accessories?category=belts" className="category-card">
          <h3>Belts</h3>
        </Link>
      </div>
    </section>
  );
}
