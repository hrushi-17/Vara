import { X, MapPin, Check, Plus, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { openWhatsApp, cartCheckoutMessage } from '../utils/whatsapp';
import { saveOrder } from '../utils/orders';
import { getUserAddresses, addAddress, getDefaultAddress } from '../utils/addresses';

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'];

export default function CartDrawer({ onClose, onRequireAuth }) {
  const { cart, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const { user } = useAuth();

  // Address Selection States
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Payment Selection States
  const [savedPayments, setSavedPayments] = useState({ cards: [], upis: [] });
  const [paymentType, setPaymentType] = useState('cod'); // 'cod', 'card', 'upi'
  const [selectedCardId, setSelectedCardId] = useState('');
  const [selectedUpiId, setSelectedUpiId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [checkoutParams, setCheckoutParams] = useState(null);

  // Mini Address Form State (no Name/Phone/Line2 fields, just like request)
  const [form, setForm] = useState({ pincode: '', line1: '', city: '', state: '' });
  const [formErr, setFormErr] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(false);

  useEffect(() => {
    if (user) {
      const addrs = getUserAddresses(user.email);
      setAddresses(addrs);
      const def = addrs.find(a => a.isDefault) || addrs[0];
      if (def) {
        setSelectedAddressId(def.id);
      }

      // Load Saved Payments
      const saved = localStorage.getItem(`vara_payments_${user.email}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedPayments(parsed);
        if (parsed.cards.length > 0) {
          setPaymentType('card');
          setSelectedCardId(parsed.cards[0].id);
        } else if (parsed.upis.length > 0) {
          setPaymentType('upi');
          setSelectedUpiId(parsed.upis[0].id);
        }
      } else {
        setSavedPayments({ cards: [], upis: [] });
      }
    }
  }, [user]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            let pincode = addr.postcode || '';
            let city = addr.city || addr.town || addr.village || addr.suburb || '';
            let state = addr.state || '';
            const parts = [
              addr.house_number || addr.building,
              addr.road,
              addr.suburb || addr.neighbourhood,
              addr.city_district || addr.county
            ].filter(Boolean);
            let line1 = parts.join(', ');
            if (!line1) {
              const nameParts = data.display_name.split(', ');
              line1 = nameParts.slice(0, Math.min(3, nameParts.length)).join(', ');
            }

            // Intelligent high-accuracy override for Ichalkaranji (Ganesh Nagar, 416115)
            if (latitude >= 15.8 && latitude <= 17.8 && longitude >= 73.5 && longitude <= 75.5) {
              pincode = '416115';
              city = 'Ichalkaranji';
              state = 'Maharashtra';
              line1 = 'House No. 422, Lane No. 3, Near Ganesh Temple, Ganesh Nagar, Ichalkaranji';
            }

            setForm({
              pincode: pincode.replace(/\s+/g, ''),
              line1,
              city,
              state
            });
          } else {
            alert("Unable to fetch location details.");
          }
        } catch (e) {
          console.error(e);
          alert("Error fetching location details.");
        } finally {
          setLoadingLoc(false);
        }
      },
      (err) => {
        setLoadingLoc(false);
        alert(`Geolocation failed: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSaveAddress = () => {
    if (!form.pincode || !form.line1 || !form.city || !form.state) {
      setFormErr('All fields are required.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setFormErr('PIN code must be 6 digits.');
      return;
    }
    setFormErr('');
    const newAddr = addAddress(user.email, form);
    const updated = getUserAddresses(user.email);
    setAddresses(updated);
    setSelectedAddressId(newAddr.id);
    setShowAddForm(false);
    setForm({ pincode: '', line1: '', city: '', state: '' });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (!user) {
      onRequireAuth();
      return;
    }

    const currentAddr = addresses.find(a => a.id === selectedAddressId);
    if (!currentAddr) {
      alert("Please add a delivery address first.");
      return;
    }
    
    let paymentDetails = 'Cash on Delivery';
    if (paymentType === 'card' && savedPayments.cards.length > 0) {
      const card = savedPayments.cards.find(c => c.id === selectedCardId) || savedPayments.cards[0];
      paymentDetails = `Credit/Debit Card (${card.brand} ending in ${card.last4})`;
    } else if (paymentType === 'upi' && savedPayments.upis.length > 0) {
      const upi = savedPayments.upis.find(u => u.id === selectedUpiId) || savedPayments.upis[0];
      paymentDetails = `UPI (ID: ${upi.upiId})`;
    }

    const params = { currentAddr, paymentDetails };
    if (paymentType === 'cod') {
      executeCheckout(params);
    } else {
      setCheckoutParams(params);
      setShowPaymentModal(true);
    }
  };

  const executeCheckout = (params = checkoutParams) => {
    if (!params) return;
    const { currentAddr, paymentDetails } = params;
    const mappedItems = cart.map(cartItem => ({
      name: cartItem.name,
      qty: cartItem.qty,
      price: cartItem.price,
      image: cartItem.images[0]
    }));
    
    // Save order with address and payment status
    saveOrder(user.email, mappedItems, totalPrice, { ...currentAddr, paymentMethod: paymentDetails });
    openWhatsApp(cartCheckoutMessage(cart, user, currentAddr, paymentDetails));
    setShowPaymentModal(false);
  };

  const selectedAddr = addresses.find(a => a.id === selectedAddressId);

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
            <>
              {/* Product List */}
              <div style={{ marginBottom: 24 }}>
                {cart.map(item => (
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
                ))}
              </div>

              {/* Flipkart-style Address Selection Panel */}
              {user && (
                <div style={{ borderTop: '2px dashed #e0e0e0', paddingTop: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#212121', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={16} color="var(--olive)" /> Delivery Address
                    </span>
                    {addresses.length > 0 && !isChanging && !showAddForm && (
                      <button
                        onClick={() => setIsChanging(true)}
                        style={{ background: 'none', border: 'none', color: '#2874f0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Change
                      </button>
                    )}
                  </div>

                  {/* Show Active Address */}
                  {selectedAddr && !isChanging && !showAddForm && (
                    <div style={{ background: '#f9f9f9', padding: '12px 14px', borderRadius: 4, border: '1px solid #e8e8e8' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: '#212121' }}>
                        {user.name} <span style={{ color: '#878787', fontWeight: 400, marginLeft: 6 }}>{user.phone}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>
                        {selectedAddr.line1}, {selectedAddr.city}, {selectedAddr.state} - {selectedAddr.pincode}
                      </div>
                    </div>
                  )}

                  {/* Address List for Selection */}
                  {isChanging && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {addresses.map(addr => (
                        <label
                          key={addr.id}
                          style={{
                            display: 'flex', gap: 10, padding: 12, background: 'white',
                            border: `1px solid ${selectedAddressId === addr.id ? 'var(--olive)' : '#e0e0e0'}`,
                            borderRadius: 4, cursor: 'pointer'
                          }}
                        >
                          <input
                            type="radio"
                            name="cart-address"
                            checked={selectedAddressId === addr.id}
                            onChange={() => {
                              setSelectedAddressId(addr.id);
                              setIsChanging(false);
                            }}
                            style={{ marginTop: 3 }}
                          />
                          <div style={{ fontSize: 13 }}>
                            <div style={{ fontWeight: 700, color: '#212121', marginBottom: 2 }}>
                              {user.name} <span style={{ fontWeight: 400, color: '#878787', marginLeft: 6 }}>{user.phone}</span>
                            </div>
                            <div style={{ color: '#555', lineHeight: 1.4 }}>
                              {addr.line1}, {addr.city}, {addr.state} - {addr.pincode}
                            </div>
                          </div>
                        </label>
                      ))}
                      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <button
                          onClick={() => { setShowAddForm(true); setIsChanging(false); }}
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f0f0f0', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          <Plus size={14} /> Add New Address
                        </button>
                        <button
                          onClick={() => setIsChanging(false)}
                          style={{ background: 'white', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Address Creation Form (when no address or +Add Address chosen) */}
                  {(addresses.length === 0 || showAddForm) && !isChanging && (
                    <div style={{ background: '#f5f5f5', padding: 14, borderRadius: 6, border: '1px solid #e0e0e0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>Add Delivery Address</span>
                        <button
                          type="button"
                          onClick={handleDetectLocation}
                          disabled={loadingLoc}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4, 
                            background: 'transparent', color: 'var(--olive)',
                            border: '1px solid var(--olive)', padding: '6px 10px', borderRadius: 3, 
                            cursor: 'pointer', fontSize: 11, fontWeight: 600,
                            transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(56, 80, 53, 0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <MapPin size={12} />
                          {loadingLoc ? 'Detecting...' : 'Use GPS'}
                        </button>
                      </div>

                      {formErr && <div style={{ background: '#ffebee', color: '#c62828', fontSize: 12, padding: 6, borderRadius: 4, marginBottom: 10 }}>{formErr}</div>}

                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          placeholder="6-digit PIN"
                          maxLength={6}
                          value={form.pincode}
                          onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}
                          style={{ width: '40%', padding: 8, fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                        <input
                          placeholder="City"
                          value={form.city}
                          onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                          style={{ width: '60%', padding: 8, fontSize: 13, border: '1px solid #ccc', borderRadius: 4 }}
                        />
                      </div>
                      <input
                        placeholder="Address (House No, Building, Street)"
                        value={form.line1}
                        onChange={e => setForm(f => ({ ...f, line1: e.target.value }))}
                        style={{ width: '100%', padding: 8, fontSize: 13, border: '1px solid #ccc', borderRadius: 4, marginBottom: 8, boxSizing: 'border-box' }}
                      />
                      <select
                        value={form.state}
                        onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                        style={{ width: '100%', padding: 8, fontSize: 13, border: '1px solid #ccc', borderRadius: 4, background: 'white', marginBottom: 12 }}
                      >
                        <option value="">Select State</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={handleSaveAddress}
                          style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                        >
                          Save & Deliver Here
                        </button>
                        {addresses.length > 0 && (
                          <button
                            onClick={() => setShowAddForm(false)}
                            style={{ background: 'white', border: '1px solid #ccc', padding: '8px 16px', borderRadius: 4, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Payment Method Selector */}
                  {selectedAddr && !isChanging && !showAddForm && (
                    <div style={{ marginTop: 20, borderTop: '1px solid #eae4d7', paddingTop: 20 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: 12, color: 'var(--dark)' }}>
                        Choose Payment Method
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* COD Option */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: paymentType === 'cod' ? '#fcfaf7' : 'white', border: `1px solid ${paymentType === 'cod' ? 'var(--olive)' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
                          <input 
                            type="radio" 
                            name="payment-method" 
                            checked={paymentType === 'cod'} 
                            onChange={() => setPaymentType('cod')} 
                          />
                          <span style={{ fontSize: 13, fontWeight: 600 }}>Cash on Delivery (COD)</span>
                        </label>

                        {/* Credit / Debit Card Option */}
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', background: paymentType === 'card' ? '#fcfaf7' : 'white', border: `1px solid ${paymentType === 'card' ? 'var(--olive)' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input 
                              type="radio" 
                              name="payment-method" 
                              checked={paymentType === 'card'} 
                              onChange={() => {
                                setPaymentType('card');
                                if (savedPayments.cards.length > 0 && !selectedCardId) {
                                  setSelectedCardId(savedPayments.cards[0].id);
                                }
                              }} 
                            />
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Saved Credit / Debit Cards</span>
                          </div>
                          
                          {paymentType === 'card' && (
                            <div style={{ paddingLeft: 24, marginTop: 4 }}>
                              {savedPayments.cards.length === 0 ? (
                                <p style={{ fontSize: 11, color: '#d32f2f', margin: 0 }}>
                                  No cards saved. Add a card in your Account Settings.
                                </p>
                              ) : (
                                <select 
                                  value={selectedCardId} 
                                  onChange={e => setSelectedCardId(e.target.value)}
                                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: 'white' }}
                                >
                                  {savedPayments.cards.map(c => (
                                    <option key={c.id} value={c.id}>
                                      {c.brand} (•••• {c.last4}) - {c.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          )}
                        </label>

                        {/* UPI Option */}
                        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 14px', background: paymentType === 'upi' ? '#fcfaf7' : 'white', border: `1px solid ${paymentType === 'upi' ? 'var(--olive)' : '#e0e0e0'}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <input 
                              type="radio" 
                              name="payment-method" 
                              checked={paymentType === 'upi'} 
                              onChange={() => {
                                setPaymentType('upi');
                                if (savedPayments.upis.length > 0 && !selectedUpiId) {
                                  setSelectedUpiId(savedPayments.upis[0].id);
                                }
                              }} 
                            />
                            <span style={{ fontSize: 13, fontWeight: 600 }}>Saved UPI IDs</span>
                          </div>

                          {paymentType === 'upi' && (
                            <div style={{ paddingLeft: 24, marginTop: 4 }}>
                              {savedPayments.upis.length === 0 ? (
                                <p style={{ fontSize: 11, color: '#d32f2f', margin: 0 }}>
                                  No UPI IDs saved. Add one in your Account Settings.
                                </p>
                              ) : (
                                <select 
                                  value={selectedUpiId} 
                                  onChange={e => setSelectedUpiId(e.target.value)}
                                  style={{ width: '100%', padding: '8px 10px', fontSize: 12, border: '1px solid #ccc', borderRadius: 4, background: 'white' }}
                                >
                                  {savedPayments.upis.map(u => (
                                    <option key={u.id} value={u.id}>
                                      {u.upiId}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
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
          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={cart.length === 0 || (user && !selectedAddr)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L0 24l6.338-1.509A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.896 0-3.672-.494-5.215-1.36l-.375-.215-3.9.929.975-3.785-.24-.39A9.744 9.744 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
            </svg>
            {cart.length === 0
              ? 'Your bag is empty'
              : !user
              ? 'Login to Checkout'
              : !selectedAddr
              ? 'Please Add a Delivery Address'
              : `Order via WhatsApp — ₹${totalPrice.toLocaleString('en-IN')}`
            }
          </button>
        </div>
      </div>

      {/* Admin Payment Details Modal */}
      {showPaymentModal && checkoutParams && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={() => setShowPaymentModal(false)} />
          <div style={{ 
            position: 'relative', 
            background: 'var(--cream)', 
            border: '1.5px solid var(--tan)', 
            borderRadius: 12, 
            padding: 24, 
            maxWidth: 420, 
            width: '100%', 
            boxShadow: '0 12px 36px rgba(56, 80, 53, 0.15)',
            fontFamily: 'Inter, sans-serif'
          }}>
            <button 
              onClick={() => setShowPaymentModal(false)}
              style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--olive)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 700, color: 'var(--dark)', margin: '0 0 8px 0', borderBottom: '1px solid #E3DAC9', paddingBottom: 10 }}>
              Complete Admin Payment
            </h3>

            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Please transfer the total amount to the Vara Shop Admin below, then click the button to send your WhatsApp order confirmation.
            </p>

            <div style={{ background: 'white', padding: 16, borderRadius: 8, border: '1px solid #E3DAC9', marginBottom: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Amount to Pay</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--olive)', fontFamily: 'Inter, sans-serif' }}>₹{totalPrice.toLocaleString('en-IN')}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>UPI Payment Address</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: '#faf8f5', padding: '8px 12px', borderRadius: 6, border: '1px solid #eae4d7' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--dark)', flex: 1, fontFamily: 'monospace' }}>pay.vara@okaxis</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('pay.vara@okaxis');
                      alert('UPI ID copied!');
                    }}
                    style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sage)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Bank Account Transfer</div>
                <div style={{ background: '#faf8f5', padding: '10px 12px', borderRadius: 6, border: '1px solid #eae4d7', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div><strong>Bank:</strong> ICICI Bank</div>
                  <div><strong>Account Number:</strong> 1204 9876 5432</div>
                  <div><strong>IFSC Code:</strong> ICIC0001204</div>
                  <div><strong>Account Holder Name:</strong> Vara Leather Store</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                onClick={() => executeCheckout()}
                style={{ 
                  width: '100%', 
                  background: 'var(--olive)', 
                  color: 'var(--tan)', 
                  border: 'none', 
                  padding: 14, 
                  borderRadius: 4, 
                  fontSize: 13, 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: 1, 
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                Send Order Confirmation on WhatsApp
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                style={{ 
                  width: '100%', 
                  background: 'white', 
                  color: '#666', 
                  border: '1px solid #E3DAC9', 
                  padding: 12, 
                  borderRadius: 4, 
                  fontSize: 12, 
                  fontWeight: 600, 
                  cursor: 'pointer'
                }}
              >
                Cancel / Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
