import { Link } from "@remix-run/react";

export default function Shoes() {
  return (
    <section className="shoes-section">
      <div className="section-header">
        <h2>Shoes</h2>
        <p>Step up your style with our footwear collection</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/shoes?category=sneakers" className="category-card">
          <h3>Sneakers</h3>
        </Link>
        <Link to="/collections/shoes?category=boots" className="category-card">
          <h3>Boots</h3>
        </Link>
        <Link to="/collections/shoes?category=sandals" className="category-card">
          <h3>Sandals</h3>
        </Link>
        <Link to="/collections/shoes?category=heels" className="category-card">
          <h3>Heels</h3>
        </Link>
      </div>
    </section>
  );
}
