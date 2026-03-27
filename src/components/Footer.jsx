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
            <SocialIcon href="#">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </SocialIcon>
            <SocialIcon href="#">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20.06 12 20.06 12 20.06s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
            </SocialIcon>
          </div>
        </div>
        {FOOTER_COLS.map(col => (
          <div className="footer-col" key={col.title}>
            <h6>{col.title}</h6>
            <ul className="footer-links">
              {col.links.map(l => (
                <li key={l.label}>
                  <a onClick={l.action}>{l.label}</a>
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
