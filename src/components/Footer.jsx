import { WHATSAPP_NUMBER } from '../data/products';
import { openWhatsApp } from '../utils/whatsapp';

const FOOTER_COLS = [
  {
    title: 'Collections',
    links: [
      { label: 'Laptop Bags', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Backpacks', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Travel Bags', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Wallets', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Accessories', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Craftsmanship', action: () => document.getElementById('craftsmanship')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Corporate Gifting', action: () => openWhatsApp('Hello Vara! I\'m interested in corporate gifting options.') },
      { label: 'Contact Us', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Track Order', action: () => openWhatsApp('Hello Vara! I\'d like to track my order. Order ID: ') },
      { label: 'Returns', action: () => openWhatsApp('Hello Vara! I\'d like to initiate a return/exchange.') },
      { label: 'Care Instructions', action: () => openWhatsApp('Hello Vara! Can you share leather care instructions?') },
      { label: 'FAQs', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Call Us', action: () => window.open(`tel:+${WHATSAPP_NUMBER}`) },
    ],
  },
];

const SocialIcon = ({ children, href }) => (
  <a href={href} target="_blank" rel="noreferrer" className="social-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ marginBottom: 12 }}>
            <img src="/images/logo/logo.png" alt="Vara" style={{ height: 48, objectFit: 'contain', filter: 'brightness(1.1)' }} />
          </div>
          <p className="footer-tagline">Handcrafted leather goods for modern India.</p>
          <div className="social-icons">
            <SocialIcon href={`https://wa.me/${WHATSAPP_NUMBER}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.935 1.395 5.61L0 24l6.615-1.731A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://instagram.com"><span style={{ fontSize: 13, letterSpacing: 0.5 }}>IG</span></SocialIcon>
            <SocialIcon href="https://facebook.com"><span style={{ fontSize: 13, letterSpacing: 0.5 }}>FB</span></SocialIcon>
            <SocialIcon href="https://pinterest.com"><span style={{ fontSize: 13, letterSpacing: 0.5 }}>PIN</span></SocialIcon>
          </div>
        </div>

        {FOOTER_COLS.map((col, idx) => (
          <div className="footer-col" key={idx}>
            <h6>{col.title}</h6>
            <ul className="footer-links">
              {col.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <a onClick={link.action}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <span className="footer-copy">© 2026 Vara. All Rights Reserved.</span>
        <div className="footer-made">
          Made with ♥ in Pune, India
          <span className="pay-badge">UPI</span>
          <span className="pay-badge">VISA</span>
          <span className="pay-badge">MC</span>
          <span className="pay-badge">RZP</span>
        </div>
      </div>
    </footer>
  );
}
