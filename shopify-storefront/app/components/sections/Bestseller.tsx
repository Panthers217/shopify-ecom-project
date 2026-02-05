import { Link } from "@remix-run/react";

export default function Bestseller() {
  return (
    <section className="bestseller-section">
      <div className="section-header">
        <h2>Bestsellers</h2>
        <p>Shop our most popular items</p>
      </div>

      <div className="bestseller-highlights">
        <div className="highlight-badge">
          <span className="badge-icon">⭐</span>
          <span>Top Rated</span>
        </div>
        <div className="highlight-badge">
          <span className="badge-icon">🔥</span>
          <span>Hot Items</span>
        </div>
        <div className="highlight-badge">
          <span className="badge-icon">💎</span>
          <span>Customer Favorites</span>
        </div>
      </div>

      <Link to="/collections/bestseller" className="view-all-btn">
        View All Bestsellers
      </Link>
    </section>
  );
}
