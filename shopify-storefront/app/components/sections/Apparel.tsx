import { Link } from "@remix-run/react";

export default function Apparel() {
  return (
    <section className="apparel-section">
      <div className="section-header">
        <h2>Apparel</h2>
        <p>Discover our latest clothing collection</p>
      </div>

      <div className="section-categories">
        <Link to="/collections/apparel?category=tops" className="category-card">
          <h3>Tops</h3>
        </Link>
        <Link to="/collections/apparel?category=bottoms" className="category-card">
          <h3>Bottoms</h3>
        </Link>
        <Link to="/collections/apparel?category=dresses" className="category-card">
          <h3>Dresses</h3>
        </Link>
        <Link to="/collections/apparel?category=outerwear" className="category-card">
          <h3>Outerwear</h3>
        </Link>
      </div>
    </section>
  );
}
