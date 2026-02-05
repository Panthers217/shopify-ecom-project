import { Link } from "@remix-run/react";

export default function Women() {
  return (
    <section className="women-section">
      <div className="section-header">
        <h2>Women's Collection</h2>
        <p>Explore fashion for her</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/women?category=apparel" className="category-card">
          <h3>Apparel</h3>
        </Link>
        <Link to="/collections/women?category=accessories" className="category-card">
          <h3>Accessories</h3>
        </Link>
        <Link to="/collections/women?category=jewelry" className="category-card">
          <h3>Jewelry</h3>
        </Link>
        <Link to="/collections/women?category=shoes" className="category-card">
          <h3>Shoes</h3>
        </Link>
      </div>
    </section>
  );
}
