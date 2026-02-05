import { Link } from "@remix-run/react";

export default function Kids() {
  return (
    <section className="kids-section">
      <div className="section-header">
        <h2>Kids Collection</h2>
        <p>Fun and comfortable styles for children</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/kids?category=boys" className="category-card">
          <h3>Boys</h3>
        </Link>
        <Link to="/collections/kids?category=girls" className="category-card">
          <h3>Girls</h3>
        </Link>
        <Link to="/collections/kids?category=baby" className="category-card">
          <h3>Baby</h3>
        </Link>
        <Link to="/collections/kids?category=accessories" className="category-card">
          <h3>Accessories</h3>
        </Link>
      </div>
    </section>
  );
}
