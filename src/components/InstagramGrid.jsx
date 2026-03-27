// Uses images from multiple folders as lifestyle / lookbook shots
const GRID_IMGS = [
  '/images/LB1/1.5.jpg',
  '/images/LB2/2.5.jpg',
  '/images/LB3/3.4.jpg',
  '/images/LB4/4.4.jpg',
  '/images/LB7/7.4.jpg',
];

const InstaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function InstagramGrid() {
  return (
    <section className="insta">
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">Real Customers</span>
          <h2 className="section-h2">Tag us @vara.in</h2>
        </div>
      </div>
      <div className="insta-grid">
        {GRID_IMGS.map((src, i) => (
          <div className="insta-cell" key={i}>
            <img src={src} alt={`Vara lifestyle ${i + 1}`} />
            <div className="insta-overlay">
              <InstaIcon />
              <span className="insta-overlay-text">View Post</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
