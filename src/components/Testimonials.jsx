const TESTIS = [
  { quote: '"This laptop bag has been with me for 3 years. Not a single stitch out of place."', name: 'Arjun M.', loc: 'Pune', init: 'AM' },
  { quote: '"Bought as a corporate gift for 20 employees. Everyone was impressed with quality."', name: 'Priya S.', loc: 'Bangalore', init: 'PS' },
  { quote: '"The leather has aged so beautifully. Looks even better than when I bought it."', name: 'Rahul K.', loc: 'Delhi', init: 'RK' },
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header reveal">
          <span className="eyebrow">Customer Love</span>
          <h2 className="section-h2">Loved by 50,000+ Customers</h2>
        </div>
        <div className="testi-grid">
          {TESTIS.map((t, i) => (
            <div className="testi-card reveal" key={t.name} style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-quote">{t.quote}</p>
              <div className="testi-author">
                <div className="testi-avatar">{t.init}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-loc">{t.loc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
