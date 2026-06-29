import { useState } from 'react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function AllProducts({ searchQuery, navigate, onAddedToCart, onRequireAuth }) {
  const isCategoryQuery = CATEGORIES.some(cat => cat.id === searchQuery);
  const [filter, setFilter] = useState('all');

  const activeFilter = isCategoryQuery ? searchQuery : filter;

  let filtered = activeFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeFilter);
  
  if (searchQuery && !isCategoryQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
  }

  const handleFilterClick = (catId) => {
    if (isCategoryQuery || searchQuery) {
      navigate({ name: 'products', query: catId === 'all' ? '' : catId });
    } else {
      setFilter(catId);
    }
  };

  return (
    <div className="page-container all-products-container">
      <div className="container">
        <div className="section-header">
          <h1 className="section-h2">
            {searchQuery && !isCategoryQuery 
              ? `Search Results for "${searchQuery}"` 
              : isCategoryQuery 
              ? CATEGORIES.find(c => c.id === searchQuery)?.label 
              : 'All Collections'}
          </h1>
          <p style={{ color: 'var(--olive)', marginTop: 8 }}>{filtered.length} products found</p>
        </div>

        <div className="filter-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`filter-tab${activeFilter === cat.id ? ' active' : ''}`}
              onClick={() => handleFilterClick(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="prod-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                navigate={navigate}
                onAddedToCart={onAddedToCart}
                onRequireAuth={onRequireAuth}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
            <h2>No products matched your search.</h2>
            <button className="btn-tan" style={{ marginTop: 24 }} onClick={() => navigate({ name: 'products', query: '' })}>
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
