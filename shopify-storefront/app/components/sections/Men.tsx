import { Link } from "@remix-run/react";

export default function Men() {
  return (
    <section className="men-section">
      <div className="section-header">
        <h2>Men's Collection</h2>
        <p>Discover fashion for him</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/men?category=apparel" className="category-card">
          <h3>Apparel</h3>
        </Link>
        <Link to="/collections/men?category=accessories" className="category-card">
          <h3>Accessories</h3>
        </Link>
        <Link to="/collections/men?category=shoes" className="category-card">
          <h3>Shoes</h3>
        </Link>
        <Link to="/collections/men?category=grooming" className="category-card">
          <h3>Grooming</h3>
        </Link>
      </div>
    </section>
  );
}
