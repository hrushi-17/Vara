export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="craft">
      <div className="craft-inner">
        <div className="craft-img reveal-left">
          <img src="/images/LB5/5.2.jpg" alt="Craftsman at work — Vara leather artisan" />
        </div>
        <div className="craft-text reveal-right">
          <span className="eyebrow">The Craft</span>
          <h2 className="craft-h2">Every Stitch Tells a Story</h2>
          <p className="craft-body">
            Our artisans have spent decades perfecting the balance between form and function.
            From pattern cutting to final finishing, every bag passes through 47 quality
            checkpoints before it reaches your hands.
          </p>
          <div>
            {[
              { icon: '⬡', title: 'Saddle Stitch', sub: 'Hand-stitched for 3× durability' },
              { icon: '⬡', title: 'Vegetable Tanned', sub: 'Natural leather that ages beautifully' },
              { icon: '⬡', title: 'Brass Hardware', sub: 'Solid brass fittings, not zinc alloy' },
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
