// Uses images from multiple folders as lifestyle / lookbook shots
const GRID_IMGS = [
  { src: '/images/products/premium/IJHYKN-W017/IJHYKN-W017_1.jpg', name: 'White Diamonds in the sky' },
  { src: '/images/products/premium/JBFYKN-W042/JBFYKN-W042_1.jpg', name: 'Wedding Blues' },
  { src: '/images/products/premium/LLFYKL-W026/LLFYKL-W026_1.jpg', name: 'Vintage Toes' },
  { src: '/images/products/premium/UUFYKL-W066/UUFYKL-W066_1.jpg', name: 'The Maharani Classic' },
  { src: '/images/products/premium/FFHYKP-W036/FFHYKP-W036_1.jpg', name: 'Jari Lime' },
  { src: '/images/products/premium/ICFNKP-M027/ICFNKP-M027_1.jpg', name: 'Daily Black' },
  { src: '/images/products/premium/JBFYKN-M077/JBFYKN-M077_1.jpg', name: 'Wedding Blues' },
  { src: '/images/products/premium/MMFYKL-M014/MMFYKL-M014_1.jpg', name: 'Classic Burgandy' },
  { src: '/images/products/premium/PBHYKN-M074/PBHYKN-M074_1.jpg', name: 'Blue Denim Dapper' },
  { src: '/images/products/premium/UUFYKL-M017/UUFYKL-M017_1.jpg', name: 'Classic Maharaja' },
];

const InstaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
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
          <h2 className="section-h2">Tag us @varavee.in</h2>
        </div>
      </div>
      <div className="insta-grid">
        {GRID_IMGS.map((item, i) => (
          <a 
            href="https://www.instagram.com/varavee.internationals.pvt_ltd?igsh=MWtpcmF0NjVidXB0dQ==" 
            target="_blank" 
            rel="noreferrer" 
            className="insta-cell" 
            key={i}
            style={{ textDecoration: 'none' }}
          >
            <img src={item.src} alt={`Varavee lifestyle ${i + 1}`} />
            <div className="insta-overlay">
              <InstaIcon />
              <span className="insta-overlay-text">View Post</span>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', marginTop: '6px', textAlign: 'center', padding: '0 10px' }}>
                {item.name}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
