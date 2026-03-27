import { ChevronRight } from 'lucide-react';

const CATS = [
  {
    name: 'Laptop Bags',
    count: '12 Styles',
    bg: '#D5CBB0',
    textColor: '#1C1C1C',
    img: '/images/LB1/1.4.jpg',
    filter: 'laptop',
  },
  {
    name: 'Backpacks',
    count: '8 Styles',
    bg: '#385035',
    textColor: '#FDF6E3',
    img: '/images/LB2/2.4.jpg',
    filter: 'backpacks',
  },
  {
    name: 'Travel Bags',
    count: '6 Styles',
    bg: '#B27138',
    textColor: '#FDF6E3',
    img: '/images/LB4/4.5.jpeg',
    filter: 'travel',
  },
];

export default function Categories({ onFilter }) {
  const handleClick = (filter) => {
    if (onFilter) onFilter(filter);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

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
              <div className="cat-img">
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
      </div>
    </section>
  );
}
