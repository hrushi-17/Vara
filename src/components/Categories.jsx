import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';

const CATS = [
  {
    name: 'Premium Men',
    count: '45 Styles',
    bg: '#385035',
    textColor: '#FDF6E3',
    img: '/images/products/premium/AAFYKL-M001/AAFYKL-M001_1.jpg',
    filter: 'premium-men',
  },
  {
    name: 'Premium Women',
    count: '39 Styles',
    bg: '#B27138',
    textColor: '#FDF6E3',
    img: '/images/products/premium/AAFYKL-W002/AAFYKL-W002_1.jpg',
    filter: 'premium-women',
  },
  {
    name: 'Basic Men',
    count: '15 Styles',
    bg: '#D5CBB0',
    textColor: '#1C1C1C',
    img: '/images/products/basic-men/ETSY-M-001/LLHNMP-M200_1.jpg',
    filter: 'basic-men',
  },
  {
    name: 'Basic Women',
    count: '13 Styles',
    bg: '#6E8B7E',
    textColor: '#FDF6E3',
    img: '/images/products/basic-women/ETSY-W-002/NNHNMP-W300_1.jpg',
    filter: 'basic-women',
  },
];

export default function Categories({ onFilter }) {
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const pauseRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  const handleClick = (filter) => {
    if (onFilter) onFilter(filter);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getCardWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const card = el.querySelector('.cat-card');
    if (!card) return 0;
    const gap = 20;
    return card.offsetWidth + gap;
  }, []);

  const scrollToIndex = useCallback((index) => {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(index, CATS.length - 1));
    setActiveIndex(clamped);
    el.scrollTo({ left: clamped * getCardWidth(), behavior: 'smooth' });
  }, [getCardWidth]);

  const startAutoScroll = useCallback(() => {
    clearInterval(autoScrollRef.current);
    autoScrollRef.current = setInterval(() => {
      if (pauseRef.current) return;
      setActiveIndex(prev => {
        const next = prev >= CATS.length - 1 ? 0 : prev + 1;
        const el = scrollRef.current;
        if (el) {
          if (next === 0) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            el.scrollTo({ left: next * getCardWidth(), behavior: 'smooth' });
          }
        }
        return next;
      });
    }, 2800);
  }, [getCardWidth]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      clearInterval(autoScrollRef.current);
      return;
    }
    startAutoScroll();
    return () => clearInterval(autoScrollRef.current);
  }, [isMobile, startAutoScroll]);

  // Update dot indicator on manual scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isMobile) return;
    const onScroll = () => {
      const cardW = getCardWidth();
      if (!cardW) return;
      const idx = Math.round(el.scrollLeft / cardW);
      setActiveIndex(Math.max(0, Math.min(idx, CATS.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [isMobile, getCardWidth]);

  const pause = () => { pauseRef.current = true; };
  const resume = () => { pauseRef.current = false; };

  if (!isMobile) {
    return (
      <section id="collections" className="categories">
        <div className="container">
          <div className="section-header reveal">
            <span className="eyebrow">Shop by Category</span>
            <h2 className="section-h2">Built for Every Journey</h2>
          </div>
          <div className="cat-grid">
            {CATS.map((c, i) => (
              <div
                className="cat-card reveal"
                key={c.name}
                style={{ transitionDelay: `${i * 0.15}s`, background: c.bg }}
                onClick={() => handleClick(c.filter)}
              >
                <div className="cat-img"><img src={c.img} alt={c.name} /></div>
                <div className="cat-body">
                  <div className="cat-name" style={{ color: c.textColor }}>{c.name}</div>
                  <div className="cat-sub" style={{ color: c.textColor, opacity: 0.8 }}>
                    Explore the range <ChevronRight size={14} />
                  </div>
                  <span className="cat-badge">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="collections" className="categories">
      <div className="cat-scroll-header">
        <span className="eyebrow">Shop by Category</span>
        <h2 className="section-h2">Built for Every Journey</h2>
      </div>

      <div className="cat-scroll-wrapper"
        onMouseEnter={pause} onMouseLeave={resume}
        onTouchStart={pause} onTouchEnd={resume}
      >
        {/* Prev arrow */}
        <button
          className="cat-arrow cat-arrow-left"
          onClick={() => { pause(); scrollToIndex(activeIndex - 1); setTimeout(resume, 1200); }}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable track */}
        <div className="cat-scroll-track" ref={scrollRef}>
          {CATS.map((c, i) => (
            <div
              className="cat-card-scroll"
              key={c.name}
              style={{ background: c.bg }}
              onClick={() => handleClick(c.filter)}
            >
              <div className="cat-img-scroll">
                <img src={c.img} alt={c.name} />
              </div>
              <div className="cat-body">
                <div className="cat-name" style={{ color: c.textColor }}>{c.name}</div>
                <div className="cat-sub" style={{ color: c.textColor, opacity: 0.8 }}>
                  Explore the range <ChevronRight size={14} />
                </div>
                <span className="cat-badge">{c.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className="cat-arrow cat-arrow-right"
          onClick={() => { pause(); scrollToIndex(activeIndex + 1); setTimeout(resume, 1200); }}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="cat-dots">
        {CATS.map((_, i) => (
          <button
            key={i}
            className={`cat-dot${activeIndex === i ? ' active' : ''}`}
            onClick={() => { pause(); scrollToIndex(i); setTimeout(resume, 1500); }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
