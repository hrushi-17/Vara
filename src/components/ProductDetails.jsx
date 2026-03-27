import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { openWhatsApp, buyNowMessage } from '../utils/whatsapp';
import { saveOrder } from '../utils/orders';

export default function ProductDetails({ productId, navigate, onAddedToCart, onRequireAuth }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return (
      <div style={{ padding: '160px 0', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn-tan" onClick={() => navigate({ name: 'home' })}>Go Home</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, qty);
    if (onAddedToCart) onAddedToCart(product.name);
  };

  const handleBuyNow = () => {
    if (!user) {
      onRequireAuth();
      return;
    }
    saveOrder(user.email, { name: product.name, qty, oldPrice: product.oldPrice, price: product.price, image: product.images[0] }, product.price * qty);
    openWhatsApp(buyNowMessage(product, qty, user));
  };

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  return (
    <div className="page-container" style={{ padding: '120px 0 60px' }}>
      <div className="container">
        
        <button onClick={() => navigate({ name: 'products' })} style={{ background: 'none', border: 'none', color: 'var(--rust)', cursor: 'pointer', marginBottom: 24, fontSize: 14 }}>
          ← Back to Catalog
        </button>

        <div className="modal-content" style={{ display: 'flex', flexDirection: 'row', gap: '40px', background: 'white', padding: 32, borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div className="modal-left" style={{ flex: '1', display: 'flex', gap: '16px' }}>
            <div className="modal-thumbs" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${product.name} ${i}`} 
                  className={`modal-thumb-img${selectedImg === i ? ' active' : ''}`}
                  onClick={() => setSelectedImg(i)}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', border: selectedImg === i ? '2px solid var(--olive)' : '1px solid #eee' }}
                />
              ))}
            </div>
            <div className="modal-main-img" style={{ flex: 1 }}>
              <img src={product.images[selectedImg]} alt={product.name} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: 4 }} />
            </div>
          </div>

          <div className="modal-right" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <div className="prod-badge" style={{ alignSelf: 'flex-start', marginBottom: 12 }}>{product.badge}</div>
            <h2 className="modal-title" style={{ fontSize: 32, fontFamily: 'Cormorant Garamond, serif', color: 'var(--olive)', marginBottom: 8 }}>{product.name}</h2>
            <div className="modal-type" style={{ color: 'var(--rust)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{product.type}</div>
            
            <div className="modal-price-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="modal-price" style={{ fontSize: 24, fontWeight: 600, color: 'var(--dark)' }}>₹{product.price.toLocaleString('en-IN')}</span>
              <span className="modal-old" style={{ textDecoration: 'line-through', color: '#888', fontSize: 18 }}>₹{product.oldPrice.toLocaleString('en-IN')}</span>
              <span className="modal-discount" style={{ background: '#385035', color: '#CF9C5F', padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>-{discount}%</span>
            </div>

            <p className="modal-desc" style={{ color: '#444', lineHeight: 1.6, marginBottom: 32 }}>
              A masterclass in functional design. Handcrafted from premium vegetable-tanned leather, featuring solid brass hardware and meticulous saddle stitching for lifelong durability.
            </p>

            <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
              <span className="qty-label" style={{ fontWeight: 500 }}>Quantity:</span>
              <div className="qty-ctrl" style={{ display: 'flex', border: '1px solid #ccc', borderRadius: 4, overflow: 'hidden' }}>
                <button className="qty-btn" style={{ padding: '8px 16px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input 
                  className="qty-num" 
                  type="number" 
                  min={1} 
                  value={qty} 
                  onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: 50, textAlign: 'center', border: 'none', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', outline: 'none' }}
                />
                <button className="qty-btn" style={{ padding: '8px 16px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }} onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="modal-actions" style={{ display: 'flex', gap: 16, marginTop: 'auto' }}>
              <button className="btn-cart" onClick={handleAddToCart} style={{ flex: 1, padding: '14px', background: 'white', border: '1px solid var(--olive)', color: 'var(--olive)', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}>
                Add to Cart
              </button>
              <button className="btn-buy" onClick={handleBuyNow} style={{ flex: 1, padding: '14px', background: 'var(--olive)', border: 'none', color: 'white', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}>
                Buy Now
              </button>
            </div>
            
            <div style={{ marginTop: 24, padding: 16, background: '#fcfcfc', border: '1px solid #eee', fontSize: 13, color: '#666', borderRadius: 4 }}>
              <strong>✓ Free Shipping</strong> across India<br/>
              <strong>✓ 7-Day Returns</strong> on unused items<br/>
              <strong>✓ Lifetime Warranty</strong> on hardware
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
