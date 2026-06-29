import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCTS } from '../data/products';
import { openWhatsApp, buyNowMessage } from '../utils/whatsapp';
import { saveOrder } from '../utils/orders';
import { getDefaultAddress } from '../utils/addresses';

export default function ProductDetails({ productId, navigate, onAddedToCart, onRequireAuth }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(8);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSelectedImg(0);
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
    const productWithSize = {
      ...product,
      type: `${product.type} · Size ${selectedSize}`
    };
    addItem(productWithSize, qty);
    if (onAddedToCart) onAddedToCart(product.name);
  };

  const handleBuyNow = () => {
    // By adding to cart, it opens the CartDrawer which enforces the Address -> Payment checkout flow.
    handleAddToCart();
  };

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);

  return (
    <div className="page-container product-details-container">
      <div className="container">
        
        <button onClick={() => navigate({ name: 'products' })} style={{ background: 'none', border: 'none', color: 'var(--rust)', cursor: 'pointer', marginBottom: 24, fontSize: 14 }}>
          ← Back to Catalog
        </button>

        <div className="modal-content">
          <div className="modal-left">
            <div className="modal-thumbs">
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
              {product.video && (
                <div 
                  className={`modal-thumb-img video-thumb${selectedImg === 'video' ? ' active' : ''}`}
                  onClick={() => setSelectedImg('video')}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                    border: selectedImg === 'video' ? '2px solid var(--olive)' : '1px solid #eee',
                    background: '#000',
                    color: '#fff',
                    position: 'relative',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  {product.images && product.images[0] && (
                    <img src={product.images[0]} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} alt="Video Preview" />
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#CF9C5F" stroke="none" style={{ position: 'relative', zIndex: 2 }}>
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  <span style={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '2px', position: 'relative', zIndex: 2, color: '#fff' }}>Video</span>
                </div>
              )}
            </div>
            <div className="modal-main-img">
              {selectedImg === 'video' ? (
                <video 
                  src={product.video} 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  onTimeUpdate={(e) => {
                    // Loop early if product specifies an endTrim (to skip baked-in black screens)
                    if (product.endTrim && e.target.currentTime >= product.endTrim) {
                      e.target.currentTime = 0;
                      e.target.play();
                    }
                  }}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    maxHeight: '500px', 
                    display: 'block', 
                    objectFit: 'cover', 
                    transform: 'scale(1.03)', /* slight zoom to hide baked-in video borders */
                    borderRadius: 4, 
                    backgroundColor: '#fcfcfc' 
                  }}
                />
              ) : (
                <img src={product.images[selectedImg]} alt={product.name} style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover', borderRadius: 4 }} />
              )}
            </div>
          </div>

          <div className="modal-right">
            <div className="prod-badge" style={{ position: 'static', alignSelf: 'flex-start', marginBottom: 12 }}>{product.badge}</div>
            <h2 className="modal-title" style={{ fontSize: 32, fontFamily: 'Cormorant Garamond, serif', color: 'var(--olive)', marginBottom: 8 }}>{product.name}</h2>
            <div className="modal-type" style={{ color: 'var(--rust)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>{product.type}</div>
            
            <div className="modal-price-row" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span className="modal-price" style={{ fontSize: 24, fontWeight: 600, color: 'var(--dark)' }}>₹{product.price.toLocaleString('en-IN')}</span>
              <span className="modal-old" style={{ textDecoration: 'line-through', color: '#888', fontSize: 18 }}>₹{product.oldPrice.toLocaleString('en-IN')}</span>
              <span className="modal-discount" style={{ background: '#385035', color: '#CF9C5F', padding: '4px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 }}>-{discount}%</span>
            </div>

            <p className="modal-desc" style={{ color: '#444', lineHeight: 1.6, marginBottom: 24 }}>
              {product.description || 'A masterclass in functional design. Handcrafted from premium vegetable-tanned leather, featuring meticulously hand-stitched detailing and high comfort footbed.'}
            </p>

            {/* Size Selector */}
            <div className="size-row" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 500, fontSize: 14 }}>Select Size (UK/India):</span>
                <button 
                  onClick={() => setShowSizeChart(true)} 
                  style={{ background: 'none', border: 'none', color: 'var(--rust)', cursor: 'pointer', fontSize: 13, textDecoration: 'underline', fontWeight: 600 }}
                >
                  Size Chart
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[6, 7, 8, 9, 10, 11].map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '4px', 
                      border: selectedSize === size ? '2px solid var(--olive)' : '1px solid #ccc',
                      background: selectedSize === size ? 'var(--cream)' : 'white',
                      color: selectedSize === size ? 'var(--olive)' : '#333',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: '0.2s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

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

            <div className="modal-actions">
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
              <strong>✓ Premium Leather</strong> Handcrafted details
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowSizeChart(false)} />
          <div style={{ 
            position: 'relative', 
            background: 'white', 
            borderRadius: 8, 
            padding: 24, 
            maxWidth: 500, 
            width: '100%', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            textAlign: 'center',
            zIndex: 1201
          }}>
            <button 
              onClick={() => setShowSizeChart(false)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888' }}
            >
              &times;
            </button>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--olive)', marginBottom: 16 }}>
              Footwear Size Guide
            </h3>
            <img 
              src="/images/size_chart.jpg" 
              alt="Size Chart" 
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain', borderRadius: 4, marginBottom: 16 }} 
            />
            <p style={{ fontSize: 12, color: '#666', margin: 0 }}>
              All measurements are standard UK/Indian sizes. If you are between sizes, we recommend ordering the larger size.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
