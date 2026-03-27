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
          Bags Built<br />to Last a <span className="accent">Lifetime</span>
        </h1>
        <p className="hero-body">
          We design leather bags that are made to be used — every day, not just occasionally.
          Genuine leather. Honest craft. Built for India.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={scrollToProducts}>Shop Collection</button>
          <button className="btn-outline" onClick={scrollToAbout}>Our Story</button>
        </div>
        <div className="hero-trust">
          <span>✓ Genuine Leather</span>
          <span>✓ Lifetime Stitching</span>
          <span>✓ Made in India</span>
        </div>
      </div>
      <div className={`hero-right reveal-right${visible ? ' reveal-visible' : ''}`}>
        <img src="/images/LB1/1.1.webp" alt="Vara Leather Bag — Executive Laptop Bag in Brown" />
      </div>
    </section>
  );
}
