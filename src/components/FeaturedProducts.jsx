import { PRODUCTS } from '../data/products';
import ProductCard from './ProductCard';

export default function FeaturedProducts({ navigate, onAddedToCart, onRequireAuth }) {
  const bestsellers = PRODUCTS.filter(p => p.badge && p.badge.toLowerCase().includes('bestseller')).slice(0, 4);

  return (
    <section id="products" className="products-section">
      <div className="container">
        <div className="products-header reveal">
          <div>
            <span className="eyebrow">Bestsellers</span>
            <h2 className="section-h2" style={{ marginBottom: 0 }}>Our Most Loved Pieces</h2>
          </div>
          <button className="view-all-link" onClick={() => navigate({ name: 'products' })}>
            View All ({PRODUCTS.length}) →
          </button>
        </div>

        <div className="prod-grid">
          {bestsellers.map((p, i) => (
            <div key={p.id} style={{ transitionDelay: `${(i % 4) * 0.1}s` }}>
              <ProductCard
                product={p}
                navigate={navigate}
                onAddedToCart={onAddedToCart}
                onRequireAuth={onRequireAuth}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
