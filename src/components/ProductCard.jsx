import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { openWhatsApp, buyNowMessage } from '../utils/whatsapp';
import { saveOrder } from '../utils/orders';

// WhatsApp SVG inline
const WAIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L0 24l6.338-1.509A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.896 0-3.672-.494-5.215-1.36l-.375-.215-3.9.929.975-3.785-.24-.39A9.744 9.744 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
  </svg>
);

export default function ProductCard({ product, navigate, onAddedToCart, onRequireAuth }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addItem(product, qty);
    if (onAddedToCart) onAddedToCart(product.name);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      onRequireAuth();
      return;
    }
    saveOrder(user.email, { name: product.name, qty, oldPrice: product.oldPrice, price: product.price, image: product.images[0] }, product.price * qty);
    openWhatsApp(buyNowMessage(product, qty, user));
  };

  const nextImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % product.images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + product.images.length) % product.images.length);
  };

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  
  // Create a realistic mock rating between 4.1 and 4.8 based on the product ID
  const rating = (4.1 + (product.id % 8) * 0.1).toFixed(1);

  return (
    <div className="prod-card reveal">
      <div className="prod-img-wrap" onClick={() => navigate({ name: 'product', id: product.id })}>
        <img src={product.images[imgIdx]} alt={product.name} />
        <span className="prod-badge">{product.badge}</span>
        
        {/* Flipkart-style Image Carousel Controls */}
        {product.images.length > 1 && (
          <>
            <button className="carousel-btn left" onClick={prevImg}>❮</button>
            <button className="carousel-btn right" onClick={nextImg}>❯</button>
          </>
        )}

        <button className="prod-quickview" onClick={(e) => { e.stopPropagation(); navigate({ name: 'product', id: product.id }) }}>
          Quick View — {product.images.length} Photos
        </button>
        {product.images.length > 1 && (
          <div className="img-dots" onClick={e => e.stopPropagation()}>
            {product.images.map((_, i) => (
              <button
                key={i}
                className={`img-dot${i === imgIdx ? ' active' : ''}`}
                onClick={() => setImgIdx(i)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="prod-body">
        <div className="prod-name" onClick={() => navigate({ name: 'product', id: product.id })} style={{ cursor: 'pointer' }}>
          {product.name}
        </div>
        <div className="prod-sub">{product.type}</div>
        <div className="prod-price-row">
          <span className="prod-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="prod-old">₹{product.oldPrice.toLocaleString('en-IN')}</span>
          <span style={{ fontSize: 9, background: '#385035', color: '#CF9C5F', padding: '2px 6px', borderRadius: 10, fontWeight: 600 }}>
            -{discount}%
          </span>
        </div>
        
        {/* Flipkart-Level Rating Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
          <span style={{ backgroundColor: '#388E3C', color: 'white', fontSize: '11px', fontWeight: '600', padding: '2px 6px', borderRadius: '3px', display: 'flex', alignItems: 'center', gap: '3px', fontFamily: 'Inter, sans-serif' }}>
            {rating} <span style={{ fontSize: '10px' }}>★</span>
          </span>
          <span style={{ fontSize: '12px', color: '#878787', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
            ({product.stars.toLocaleString('en-IN')})
          </span>
        </div>

        <div className="qty-row">
          <span className="qty-label">Qty:</span>
          <div className="qty-ctrl">
            <button className="qty-btn" onClick={(e) => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)) }}>−</button>
            <input
              className="qty-num"
              type="number"
              min={1}
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              onClick={e => e.stopPropagation()}
            />
            <button className="qty-btn" onClick={(e) => { e.stopPropagation(); setQty(q => q + 1) }}>+</button>
          </div>
        </div>

        <div className="card-actions">
          <button className="btn-cart" onClick={handleAddToCart}>+ Cart</button>
          <button className="btn-buy" onClick={handleBuyNow}>
            <WAIcon /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
