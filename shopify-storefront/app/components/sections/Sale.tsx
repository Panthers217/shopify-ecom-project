import { Link } from "@remix-run/react";

export default function Sale() {
  return (
    <section className="sale-section">
      <div className="section-header">
        <h2>Sale</h2>
        <p>Don't miss out on amazing deals!</p>
      </div>

      <div className="sale-banner">
        <div className="sale-highlight">
          <span className="discount-badge">UP TO 50% OFF</span>
          <p>Limited time offers on selected items</p>
        </div>
      </div>

      <div className="section-categories">
        <Link to="/collections/sale?category=women" className="category-card">
          <h3>Women's Sale</h3>
        </Link>
        <Link to="/collections/sale?category=men" className="category-card">
          <h3>Men's Sale</h3>
        </Link>
        <Link to="/collections/sale?category=kids" className="category-card">
          <h3>Kids Sale</h3>
        </Link>
        <Link to="/collections/sale?category=clearance" className="category-card">
          <h3>Clearance</h3>
        </Link>
      </div>
    </section>
  );
}
