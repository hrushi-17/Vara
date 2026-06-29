import { useState, useEffect } from 'react';

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className={`hero-left reveal-left${visible ? ' reveal-visible' : ''}`}>
        <span className="hero-eyebrow">Handcrafted Since 2010</span>
        <h1 className="hero-h1">
          Footwear Built<br />to Last a <span className="accent">Lifetime</span>
        </h1>
        <p className="hero-body">
          We design premium leather Kolhapuri chappals that are made to be worn — every day, not just occasionally.
          Genuine leather. Honest craft. Built for India.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={scrollToProducts}>Shop Collection</button>
          <button className="btn-outline" onClick={scrollToAbout}>Our Story</button>
        </div>
        <div className="hero-trust">
          <span>✓ Genuine Leather</span>
          <span>✓ Premium Comfort</span>
          <span>✓ Made in India</span>
        </div>
      </div>
      <div className={`hero-right reveal-right${visible ? ' reveal-visible' : ''}`}>
        <img src="/images/products/premium/AAFYKL-M001/AAFYKL-M001_1.jpg" alt="Varavee Leather Footwear — Premium Kolhapuri Shoe in Brown" />
      </div>
    </section>
  );
}
