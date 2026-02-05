export default function NewMerch() {
  return (
    <section className="new-merch-section">
      <div className="new-merch-banner">
        <h2>New Arrivals</h2>
        <p>Discover our latest collection of fashion-forward pieces</p>
      </div>

      <div className="new-merch-highlights">
        <div className="highlight-card">
          <div className="highlight-icon">✨</div>
          <h3>Fresh Styles</h3>
          <p>Just landed from top designers</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">🎯</div>
          <h3>Trending Now</h3>
          <p>Most popular items this season</p>
        </div>

        <div className="highlight-card">
          <div className="highlight-icon">🔥</div>
          <h3>Limited Edition</h3>
          <p>Exclusive pieces won't last long</p>
        </div>
      </div>
    </section>
  );
}
