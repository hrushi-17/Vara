import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { openWhatsApp, cartCheckoutMessage } from '../utils/whatsapp';
import { saveOrder } from '../utils/orders';

export default function CartDrawer({ onClose, onRequireAuth }) {
  const { cart, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      onRequireAuth();
      return;
    }
    
    const mappedItems = cart.map(cartItem => ({
      name: cartItem.name,
      qty: cartItem.qty,
      price: cartItem.price,
      image: cartItem.images[0]
    }));
    
    saveOrder(user.email, mappedItems, totalPrice);
    openWhatsApp(cartCheckoutMessage(cart, user));
  };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="cart-title">Your Bag</span>
            {totalItems > 0 && (
              <span className="cart-count-badge">{totalItems} item{totalItems > 1 ? 's' : ''}</span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#828D76' }}
          >
            <X size={22} />
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛍️</div>
              <div className="cart-empty-text">Your bag is empty</div>
              <p style={{ fontSize: 13, color: '#828D76', textAlign: 'center' }}>
                Add some beautiful leather goods to get started.
              </p>
            </div>
          ) : (
            cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img
                  className="cart-item-img"
                  src={item.images[0]}
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-sub">{item.type}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <div className="qty-ctrl">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >−</button>
                      <input
                        className="qty-num"
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                      />
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                      >+</button>
                    </div>
                    <span className="cart-item-price">
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeItem(item.id)}>×</button>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          {cart.length > 0 && (
            <>
              <div className="cart-total-row">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-val">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontSize: 11, color: '#828D76', marginBottom: 12, textAlign: 'center' }}>
                Inclusive of all taxes. Free shipping above ₹2999.
              </p>
            </>
          )}
          <button className="btn-checkout" onClick={handleCheckout} disabled={cart.length === 0}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L0 24l6.338-1.509A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.896 0-3.672-.494-5.215-1.36l-.375-.215-3.9.929.975-3.785-.24-.39A9.744 9.744 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
            </svg>
            {cart.length === 0 ? 'Your bag is empty' : `Order via WhatsApp — ₹${totalPrice.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </>
  );
}
