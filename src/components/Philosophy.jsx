import { useState, useEffect, useRef } from 'react';

function useCountUp(target, isVisible) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (1800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target]);
  return count;
}

function StatCard({ target, suffix, label, isVisible }) {
  const count = useCountUp(target, isVisible);
  return (
    <div className="stat-card">
      <div className="stat-number">{count.toLocaleString('en-IN')}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Philosophy() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="philosophy" ref={ref}>
      <div className="philosophy-inner">
        <div className="philosophy-left reveal">
          <span className="eyebrow">Our Philosophy</span>
          <h2 className="section-h2">Well Made. Honest. Built to Last.</h2>
          <p className="section-body">
            We believe a great bag isn't just an accessory — it's a companion. At Vara, every piece is
            handcrafted by skilled artisans in India using full-grain leather, solid brass hardware, and
            a saddle-stitch technique built to outlast trends. We don't believe in fast fashion.
            We believe in slow craft.
          </p>
          <div className="ruled-line" />
        </div>
        <div className="philosophy-right reveal delay-2">
          <StatCard target={14} suffix="+" label="Years of Craft" isVisible={vis} />
          <StatCard target={50000} suffix="+" label="Bags Delivered" isVisible={vis} />
        </div>
      </div>
    </section>
  );
}
