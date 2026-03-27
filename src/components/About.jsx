export default function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="about-hero-text reveal">We Make Bags That Work</h2>
        <p className="about-body reveal delay-1">
          Born in Pune, built for modern India. Every Vara bag is a conversation between
          heritage craft and contemporary design — made by hand, built to last, and priced
          with honesty.
        </p>
        <div className="pillars">
          {[
            {
              icon: '◈',
              title: 'Genuine Leather',
              desc: 'Full-grain, vegetable-tanned hides sourced from certified Indian tanneries. Nothing synthetic, nothing hidden.',
            },
            {
              icon: '◈',
              title: 'Functional Design',
              desc: 'Every pocket, every strap, every buckle is placed with purpose. Form follows function, always.',
            },
            {
              icon: '◈',
              title: 'Honest Pricing',
              desc: 'No influencer markups. No retail inflation. We sell direct so you get the best leather at a fair price.',
            },
          ].map((p, i) => (
            <div className="pillar reveal" key={p.title} style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="pillar-icon">{p.icon}</div>
              <div className="pillar-title">{p.title}</div>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="about-img reveal">
          <img src="/images/LB6/6.2.jpg" alt="Vara Workshop — craftsmen at work" />
        </div>
      </div>
    </section>
  );
}
