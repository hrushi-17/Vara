import { useState, useEffect } from 'react';

/* Lifestyle model images chosen by user */
const ABOUT_SLIDES = [
  {
    src: '/images/products/premium/BOFNKP-M031/BIHYKP-M019_7.jpg',
    bg: '#F0EBE0',
    label: 'Varavee Men — Crafted to Walk In',
  },
  {
    src: '/images/products/basic-men/ETSY-M-004/file_00000000a8c47206b82a4ad014fb98bf.png',
    bg: '#EDE5D8',
    label: 'Basic Men — Heritage Kolhapuri',
  },
  {
    src: '/images/products/basic-women/ETSY-W-002/file_00000000c4e87207bcaa61894cc193a1.png',
    bg: '#F2EAE0',
    label: 'Basic Women — Timeless Craft',
  },
  {
    src: '/images/products/basic-women/ETSY-W-0011/file_000000004a00720ba09ea6cd820956a0.png',
    bg: '#EDE3D5',
    label: 'Basic Women — Walk with Pride',
  },
];

export default function About() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % ABOUT_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="about-hero-text reveal">We Make Footwear That Works</h2>
        <p className="about-body reveal delay-1">
          Born in Pune, built for modern India. Every Varavee piece is a conversation between
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

        {/* ── Responsive slideshow banner ── */}
        <div
          className="about-slideshow reveal"
          style={{ background: ABOUT_SLIDES[currentSlide].bg }}
        >
          {ABOUT_SLIDES.map((slide, i) => (
            <img
              key={i}
              src={slide.src}
              alt={slide.label}
              className={`about-slide-img${currentSlide === i ? ' active' : ''}`}
            />
          ))}

          {/* dark-to-transparent gradient at bottom for label readability */}
          <div className="about-slide-overlay" />

          {/* slide label */}
          <div className="about-slide-label">
            {ABOUT_SLIDES[currentSlide].label}
          </div>

          {/* pill dot indicators */}
          <div className="about-slide-dots">
            {ABOUT_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`about-dot${currentSlide === i ? ' active' : ''}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
