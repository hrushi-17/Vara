import { WHATSAPP_NUMBER } from '../data/products';
import { openWhatsApp } from '../utils/whatsapp';

const FOOTER_COLS = [
  {
    title: 'Collections',
    links: [
      { label: 'Premium Men', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Premium Women', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Basic Men', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
      { label: 'Basic Women', action: () => { document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }); } },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Craftsmanship', action: () => document.getElementById('craftsmanship')?.scrollIntoView({ behavior: 'smooth' }) },
      { label: 'Corporate Gifting', action: () => openWhatsApp('Hello Varavee! I\'m interested in corporate gifting options.') },
      { label: 'Contact Us', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Track Order', action: () => openWhatsApp('Hello Varavee! I\'d like to track my order. Order ID: ') },
      { label: 'Returns', action: () => openWhatsApp('Hello Varavee! I\'d like to initiate a return/exchange.') },
      { label: 'Care Instructions', action: () => openWhatsApp('Hello Varavee! Can you share leather care instructions?') },
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
            <img src="/images/logo/logo.jpg" alt="Varavee" style={{ height: 48, objectFit: 'contain', filter: 'brightness(1.1)' }} />
          </div>
          <p className="footer-tagline">Handcrafted leather footwear for modern India.</p>
          <div className="social-icons">
            <SocialIcon href={`https://wa.me/${WHATSAPP_NUMBER}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.025.506 3.935 1.395 5.61L0 24l6.615-1.731A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/varavee.internationals.pvt_ltd?igsh=MWtpcmF0NjVidXB0dQ==">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://facebook.com">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </SocialIcon>
            <SocialIcon href="https://pinterest.com">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z"/>
              </svg>
            </SocialIcon>
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
        <span className="footer-copy">© 2026 Varavee. All Rights Reserved. | Designed & Developed by Hrushikesh Chothe.</span>
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
