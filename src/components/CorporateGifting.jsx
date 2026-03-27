import { openWhatsApp, corporateQuoteMessage } from '../utils/whatsapp';
import { WHATSAPP_NUMBER } from '../data/products';

export default function CorporateGifting() {
  return (
    <section className="corporate">
      <span className="corp-badge">Bulk Orders Welcome</span>
      <h2 className="corp-h2 reveal">Gift Something That Lasts</h2>
      <p className="corp-body reveal delay-1">
        Bulk orders for corporates, weddings & special occasions.
        Custom engraving, branded packaging, and volume discounts available.
        Minimum 10 bags for corporate pricing.
      </p>
      <div className="corp-btns reveal delay-2">
        <button
          className="btn-tan"
          onClick={() => openWhatsApp(corporateQuoteMessage())}
        >
          🏢 Request a Quote
        </button>
        <a
          href={`tel:+${WHATSAPP_NUMBER}`}
          className="btn-outline-cream"
          style={{ textDecoration: 'none', display: 'inline-block', lineHeight: '1' }}
        >
          📞 Call Us Now
        </a>
      </div>
      <p style={{ color: '#828D76', fontSize: 12, marginTop: 24, position: 'relative' }}>
        ✦ Custom logo embossing &nbsp;·&nbsp; Gift wrapping &nbsp;·&nbsp; Pan-India delivery &nbsp;·&nbsp; GST invoice available
      </p>
    </section>
  );
}
