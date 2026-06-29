export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="craft">
      <div className="craft-inner">
        <div className="craft-img reveal-left">
          <img src="/images/products/premium/AAFYKL-M001/AAFYKL-M001_3.jpg" alt="Craftsman at work — Varavee leather artisan" />
        </div>
        <div className="craft-text reveal-right">
          <span className="eyebrow">The Craft</span>
          <h2 className="craft-h2">Every Stitch Tells a Story</h2>
          <p className="craft-body">
            Our artisans have spent decades perfecting the balance between form and function.
            From pattern cutting to final finishing, every piece passes through quality
            checkpoints before it reaches your hands.
          </p>
          <div>
            {[
              { icon: '⬡', title: 'Saddle Stitch', sub: 'Hand-stitched for 3× durability' },
              { icon: '⬡', title: 'Vegetable Tanned', sub: 'Natural leather that ages beautifully' },
              { icon: '⬡', title: 'Anti-slip Sole', sub: 'Full TPR or Aerosole bottom for superior grip' },
            ].map(r => (
              <div className="craft-row" key={r.title}>
                <span className="craft-icon">{r.icon}</span>
                <div>
                  <div className="craft-row-title">{r.title}</div>
                  <div className="craft-row-sub">{r.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="btn-outline-tan"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Ask About Custom Orders →
          </button>
        </div>
      </div>
    </section>
  );
}
