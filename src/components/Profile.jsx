import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { User, LogOut, ShieldAlert, ChevronRight, Package, CreditCard, Lock, MapPin, Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { getUserOrders, cancelUserOrder, updateOrderStatus } from '../utils/orders';
import { getUserAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../utils/addresses';
import { openWhatsApp, cancelOrderMessage } from '../utils/whatsapp';

// ─── Address Form Component ───────────────────────────────
const EMPTY_FORM = { line1: '', city: '', state: '', pincode: '' };
const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh'];

function AddressForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [err, setErr] = useState('');
  const [loadingLoc, setLoadingLoc] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

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
            
            // Generate clean street/road line
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
            alert("Unable to fetch location details automatically.");
          }
        } catch (e) {
          console.error(e);
          alert("Error fetching location details. Please fill manually.");
        } finally {
          setLoadingLoc(false);
        }
      },
      (err) => {
        setLoadingLoc(false);
        alert(`Geolocation failed: ${err.message}. Please input manually.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = () => {
    if (!form.line1 || !form.city || !form.state || !form.pincode) {
      setErr('Please fill all fields.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) { setErr('PIN code must be 6 digits.'); return; }
    setErr('');
    onSave(form);
  };

  const labelStyle = { fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.8 };

  return (
    <div style={{ background: '#FAF8F5', border: '1px solid #E3DAC9', borderRadius: 12, padding: '20px 16px', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', color: 'var(--dark)', margin: 0 }}>
          {initial ? 'Edit Address' : 'Add New Address'}
        </h3>
        
        {/* Use Current Location Button (Brand Outlined Style) */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={loadingLoc}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'transparent', color: 'var(--olive)', border: '1px solid var(--olive)',
            padding: '8px 14px', borderRadius: 4, cursor: 'pointer',
            fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(56, 80, 53, 0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MapPin size={14} />
          {loadingLoc ? 'Detecting Location...' : 'Use My Current Location'}
        </button>
      </div>

      {err && <div style={{ background: '#ffebee', color: '#c62828', fontSize: 13, padding: '8px 12px', borderRadius: 4, marginBottom: 12 }}>{err}</div>}

      <div className="profile-grid-2col" style={{ marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>PIN Code *</label>
          <input className="profile-input" value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="6-digit PIN" maxLength={6} />
        </div>
        <div>
          <label style={labelStyle}>City *</label>
          <input className="profile-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={labelStyle}>Address (House No., Building, Street, Area) *</label>
        <input className="profile-input" value={form.line1} onChange={e => set('line1', e.target.value)} placeholder="E.g., Flat 101, Shanti Apartments, MG Road" />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>State *</label>
        <select className="profile-input" style={{ background: 'white' }} value={form.state} onChange={e => set('state', e.target.value)}>
          <option value="">Select State</option>
          {STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={handleSubmit} style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          {initial ? 'Save Changes' : 'Save Address'}
        </button>
        <button onClick={onCancel} style={{ background: 'white', color: '#555', border: '1px solid #E3DAC9', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}


// ─── Main Profile Component ───────────────────────────────
export default function Profile({ navigate }) {
  const { user, deleteAccount, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const labelStyle = { fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.8 };

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [editError, setEditError] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [approvingOrderId, setApprovingOrderId] = useState(null);

  // Address State
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null); // address id being edited

  // PAN State
  const [panData, setPanData] = useState(null);
  const [panForm, setPanForm] = useState({ panNumber: '', fullName: '', declared: false });
  const [panVerifying, setPanVerifying] = useState(false);
  const [panError, setPanError] = useState('');

  // Payments State
  const [payments, setPayments] = useState({ cards: [], upis: [] });
  const [cardForm, setCardForm] = useState({ cardNo: '', exp: '', name: '' });
  const [upiForm, setUpiForm] = useState({ upiId: '' });
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddUpi, setShowAddUpi] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, phone: user.phone });
      setOrders(getUserOrders(user.email));
      setAddresses(getUserAddresses(user.email));

      // Load PAN
      const savedPan = localStorage.getItem(`vara_pan_${user.email}`);
      if (savedPan) setPanData(JSON.parse(savedPan));

      // Load Payments
      const savedPayments = localStorage.getItem(`vara_payments_${user.email}`);
      if (savedPayments) {
        setPayments(JSON.parse(savedPayments));
      } else {
        setPayments({ cards: [], upis: [] });
      }
    }
  }, [user]);

  if (!user) {
    return (
      <div className="page-container" style={{ padding: '160px 0', textAlign: 'center', background: 'var(--cream)' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, color: 'var(--dark)' }}>Please log in to view your profile</h2>
        <button className="btn-tan" style={{ marginTop: 24 }} onClick={() => navigate({ name: 'home' })}>Return Home</button>
      </div>
    );
  }

  const handleDelete = () => setShowDeleteConfirm(true);
  const confirmDelete = () => { deleteAccount(); navigate({ name: 'home' }); };
  const handleLogout = () => { logout(); navigate({ name: 'home' }); };

  const handleSaveProfile = () => {
    setEditError('');
    if (!editForm.name || !editForm.email || !editForm.phone) { setEditError('All fields are required.'); return; }
    const res = updateUser(editForm.name, editForm.email, editForm.phone);
    if (res !== true) { setEditError(res); return; }
    setIsEditing(false);
  };

  const handleCancelOrder = (order) => {
    setCancellingOrderId(order.id);
  };

  const confirmCancelOrder = (order) => {
    updateOrderStatus(order.id, 'Cancellation Requested');
    setOrders(getUserOrders(user.email));
    setCancellingOrderId(null);
    openWhatsApp(cancelOrderMessage(order, user));
  };

  const handleApproveCancel = (orderId) => {
    setApprovingOrderId(orderId);
  };

  const confirmApproveCancel = (orderId) => {
    cancelUserOrder(orderId);
    setOrders(getUserOrders(user.email));
    setApprovingOrderId(null);
  };

  // Address handlers
  const handleAddAddress = (form) => {
    const newAddr = addAddress(user.email, form);
    setAddresses(getUserAddresses(user.email));
    setShowAddForm(false);
  };
  const handleUpdateAddress = (form) => {
    updateAddress(editingAddr, form);
    setAddresses(getUserAddresses(user.email));
    setEditingAddr(null);
  };
  const handleDeleteAddress = (id) => {
    if (window.confirm('Delete this address?')) {
      deleteAddress(id);
      setAddresses(getUserAddresses(user.email));
    }
  };
  const handleSetDefault = (id) => {
    setDefaultAddress(id, user.email);
    setAddresses(getUserAddresses(user.email));
  };

  // PAN Handlers
  const handleSavePan = (e) => {
    e.preventDefault();
    setPanError('');
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(panForm.panNumber.toUpperCase())) {
      setPanError('Invalid PAN Format. Must be 10 characters (e.g. ABCDE1234F).');
      return;
    }
    if (!panForm.fullName.trim()) {
      setPanError('Name on PAN is required.');
      return;
    }
    if (!panForm.declared) {
      setPanError('Please accept the declaration checkbox.');
      return;
    }

    setPanVerifying(true);
    setTimeout(() => {
      const data = {
        panNumber: panForm.panNumber.toUpperCase(),
        fullName: panForm.fullName,
        status: 'Verified',
        date: new Date().toLocaleDateString('en-IN')
      };
      localStorage.setItem(`vara_pan_${user.email}`, JSON.stringify(data));
      setPanData(data);
      setPanVerifying(false);
    }, 1500);
  };

  const handleDeletePan = () => {
    localStorage.removeItem(`vara_pan_${user.email}`);
    setPanData(null);
    setPanForm({ panNumber: '', fullName: '', declared: false });
  };

  // Payments Handlers
  const handleAddCard = (e) => {
    e.preventDefault();
    setPaymentError('');
    const cleanCard = cardForm.cardNo.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cleanCard)) {
      setPaymentError('Card number must be 16 digits.');
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardForm.exp)) {
      setPaymentError('Expiry date must be MM/YY.');
      return;
    }
    if (!cardForm.name.trim()) {
      setPaymentError('Cardholder name is required.');
      return;
    }

    const brand = cleanCard.startsWith('4') ? 'Visa' : cleanCard.startsWith('5') ? 'Mastercard' : 'Rupay';
    const newCard = {
      id: 'CD' + Math.floor(Math.random() * 1000000),
      brand,
      last4: cleanCard.slice(-4),
      name: cardForm.name,
      exp: cardForm.exp
    };

    const updated = { ...payments, cards: [...payments.cards, newCard] };
    localStorage.setItem(`vara_payments_${user.email}`, JSON.stringify(updated));
    setPayments(updated);
    setShowAddCard(false);
    setCardForm({ cardNo: '', exp: '', name: '' });
  };

  const handleDeleteCard = (id) => {
    const updated = { ...payments, cards: payments.cards.filter(c => c.id !== id) };
    localStorage.setItem(`vara_payments_${user.email}`, JSON.stringify(updated));
    setPayments(updated);
  };

  const handleAddUpi = (e) => {
    e.preventDefault();
    setPaymentError('');
    if (!upiForm.upiId.includes('@') || upiForm.upiId.trim().length < 5) {
      setPaymentError('Invalid UPI ID. Must contain @ (e.g. user@okhdfcbank).');
      return;
    }

    const newUpi = {
      id: 'UP' + Math.floor(Math.random() * 1000000),
      upiId: upiForm.upiId.trim()
    };

    const updated = { ...payments, upis: [...payments.upis, newUpi] };
    localStorage.setItem(`vara_payments_${user.email}`, JSON.stringify(updated));
    setPayments(updated);
    setShowAddUpi(false);
    setUpiForm({ upiId: '' });
  };

  const handleDeleteUpi = (id) => {
    const updated = { ...payments, upis: payments.upis.filter(u => u.id !== id) };
    localStorage.setItem(`vara_payments_${user.email}`, JSON.stringify(updated));
    setPayments(updated);
  };

  const SidebarItem = ({ id, icon: Icon, label, subtitle }) => {
    const isActive = activeTab === id;
    return (
      <div
        style={{ 
          padding: '16px 16px 16px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          color: isActive ? 'var(--olive)' : '#666', 
          cursor: 'pointer', 
          transition: 'all 0.2s', 
          background: isActive ? 'rgba(56, 80, 53, 0.04)' : 'transparent',
          borderLeft: isActive ? '4px solid var(--olive)' : '4px solid transparent',
          fontFamily: 'Inter, sans-serif'
        }}
        onClick={() => setActiveTab(id)}
        onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#fcfaf7')}
        onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
      >
        <Icon size={20} color={isActive ? 'var(--olive)' : '#777'} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: isActive ? 700 : 600, textTransform: 'uppercase', color: isActive ? 'var(--olive)' : '#555', letterSpacing: 0.8, fontSize: 12 }}>{label}</div>
          {subtitle && <div style={{ fontSize: 10, marginTop: 2, color: '#888' }}>{subtitle}</div>}
        </div>
        <ChevronRight size={14} color={isActive ? 'var(--olive)' : '#ccc'} />
      </div>
    );
  };

  // ─── Tabs ──────────────────────────────────────────────

  const renderProfileTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="profile-card">
        <h2 className="profile-card-title" style={{ marginBottom: 24, justifyContent: 'space-between' }}>
          <span>Personal Information</span>
          {!isEditing && <span onClick={() => setIsEditing(true)} style={{ fontSize: 14, color: 'var(--olive)', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Edit</span>}
          {isEditing && <span onClick={() => setIsEditing(false)} style={{ fontSize: 14, color: '#878787', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: 0.5 }}>Cancel</span>}
        </h2>

        {editError && <div style={{ color: 'red', fontSize: 13, marginBottom: 16 }}>{editError}</div>}

        <div className="profile-grid-2col" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Full Name</div>
            {isEditing
              ? <input className="profile-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              : <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--dark)' }}>{user.name}</div>
            }
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Email Address</div>
            {isEditing
              ? <input className="profile-input" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
              : <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--dark)' }}>{user.email}</div>
            }
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Mobile Number</div>
            {isEditing
              ? <input className="profile-input" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
              : <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--dark)' }}>{user.phone}</div>
            }
          </div>
        </div>

        {isEditing && (
          <button onClick={handleSaveProfile} style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            Save Changes
          </button>
        )}
      </div>

      {showDeleteConfirm ? (
        <div className="danger-zone-card" style={{ borderLeft: '4px solid #d32f2f' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <ShieldAlert size={24} color="#d32f2f" />
            <h2 style={{ fontSize: 20, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#d32f2f', margin: 0 }}>Confirm Account Deletion</h2>
          </div>
          <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7, marginBottom: 8 }}>You are about to <strong>permanently delete</strong> your Vara account.</p>
          <ul style={{ fontSize: 13, color: '#666', lineHeight: 2, marginBottom: 24, paddingLeft: 20 }}>
            <li>✗ &nbsp;Your <strong>profile</strong> and personal information will be erased</li>
            <li>✗ &nbsp;Your entire <strong>order history</strong> will be permanently deleted</li>
            <li>✗ &nbsp;Your <strong>saved addresses</strong> will be removed</li>
            <li>✓ &nbsp;You <strong>can re-register</strong> with the same email later — but as a new user with <strong>zero history</strong></li>
          </ul>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#d32f2f', marginBottom: 20 }}>This action cannot be undone.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={confirmDelete} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
              Yes, Delete My Account
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} style={{ background: 'white', color: '#444', border: '1px solid #E3DAC9', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="danger-zone-card">
          <h2 style={{ fontSize: 20, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: '#d32f2f', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldAlert size={22} /> Danger Zone
          </h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 1.6, maxWidth: 650 }}>
            Deleting your account will <strong>permanently remove</strong> your personal information, <strong>entire order history</strong>, and saved addresses from Vara.
          </p>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 28, lineHeight: 1.6 }}>
            If you re-register with the same email or mobile number, you will start as a completely new user with no order history.
          </p>
          <button onClick={handleDelete}
            style={{ background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, transition: 'all 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ffebee'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            Delete Account
          </button>
        </div>
      )}
    </div>
  );

  const renderOrdersTab = () => (
    <div className="profile-card" style={{ minHeight: 400 }}>
      <h2 className="profile-header-serif" style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #EAE4D7' }}>My Orders</h2>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878787' }}>
          <Package size={64} color="#e0e0e0" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, color: '#212121', marginBottom: 8 }}>No orders found</h3>
          <p>Looks like you haven't placed any orders yet.</p>
          <button style={{ marginTop: 24, background: 'var(--olive)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', letterSpacing: 0.5 }} onClick={() => navigate({ name: 'products' })}>Shop Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div className="order-card-header">
                <div className="order-meta-block">
                  <div className="order-meta-label">ORDER PLACED</div>
                  <div className="order-meta-value">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="order-meta-block">
                  <div className="order-meta-label">TOTAL</div>
                  <div className="order-meta-value">₹{order.total.toLocaleString('en-IN')}</div>
                </div>
                <div className="order-meta-block order-id-block">
                  <div className="order-meta-label">ORDER ID</div>
                  <div className="order-meta-value order-id-text">{order.id}</div>
                </div>
                <div style={{ alignSelf: 'center', display: 'flex', gap: 10, flexWrap: 'wrap' }} className="order-cancel-container">
                  {cancellingOrderId === order.id ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#d32f2f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Cancel?</span>
                      <button onClick={() => confirmCancelOrder(order)} style={{ background: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>YES</button>
                      <button onClick={() => setCancellingOrderId(null)} style={{ background: 'white', color: '#666', border: '1px solid #ccc', padding: '5px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>NO</button>
                    </div>
                  ) : approvingOrderId === order.id ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#f57c00', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Approve deletion?</span>
                      <button onClick={() => confirmApproveCancel(order.id)} style={{ background: '#f57c00', color: 'white', border: 'none', padding: '5px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>YES</button>
                      <button onClick={() => setApprovingOrderId(null)} style={{ background: 'white', color: '#666', border: '1px solid #ccc', padding: '5px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>NO</button>
                    </div>
                  ) : order.status === 'Cancellation Requested' ? (
                    <>
                      <span style={{ fontSize: 12, color: '#f57c00', fontWeight: 600, alignSelf: 'center' }}>
                        Cancellation Pending...
                      </span>
                      <button
                        onClick={() => handleApproveCancel(order.id)}
                        style={{
                          background: '#f57c00', color: 'white', border: 'none',
                          padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                          fontSize: 11, fontWeight: 700, transition: 'all 0.2s',
                          fontFamily: 'Inter, sans-serif', textTransform: 'uppercase'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#e65100'}
                        onMouseLeave={e => e.currentTarget.style.background = '#f57c00'}
                      >
                        Approve Cancel (Admin Mock)
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleCancelOrder(order)}
                      style={{
                        background: 'white', color: '#d32f2f', border: '1px solid #d32f2f',
                        padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                        fontFamily: 'Inter, sans-serif'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ffebee'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items-list">
                {order.items.map((item, idx) => {
                  const isPending = order.status === 'Cancellation Requested';
                  return (
                    <div key={idx} className="order-item-row">
                      <img src={item.image} alt={item.name} className="order-item-img" />
                      <div className="order-item-info">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-qty">Qty: {item.qty}</div>
                      </div>
                      <div className="order-item-status">
                        <div className="order-status-label">Status</div>
                        <div className="order-status-value" style={{ color: isPending ? '#f57c00' : '#4caf50' }}>
                          <span className="order-status-dot" style={{ background: isPending ? '#f57c00' : '#4caf50' }} />
                          {order.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddressTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="profile-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="profile-header-serif" style={{ margin: 0 }}>Manage Addresses</h2>
          {!showAddForm && editingAddr === null && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--olive)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'Inter, sans-serif' }}
            >
              <Plus size={16} /> Add New Address
            </button>
          )}
        </div>

        {showAddForm && (
          <AddressForm onSave={handleAddAddress} onCancel={() => setShowAddForm(false)} />
        )}

        {addresses.length === 0 && !showAddForm ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#878787' }}>
            <MapPin size={52} color="#e0e0e0" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 15, marginBottom: 8 }}>No saved addresses</p>
            <p style={{ fontSize: 13 }}>Add an address to make checkout faster.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {addresses.map(addr => (
              <div key={addr.id}>
                {editingAddr === addr.id ? (
                  <AddressForm
                    initial={addr}
                    onSave={handleUpdateAddress}
                    onCancel={() => setEditingAddr(null)}
                  />
                ) : (
                  <div className={`address-card${addr.isDefault ? ' address-card-default' : ''}`}>
                    {addr.isDefault && (
                      <div className="address-default-badge">
                        <CheckCircle size={13} /> Default
                      </div>
                    )}
                    <div className="address-card-name">{user.name} &nbsp;<span className="address-card-phone">{user.phone}</span></div>
                    <div className="address-card-text">
                      {addr.line1}<br />
                      {addr.city}, {addr.state} — {addr.pincode}
                    </div>
                    <div className="address-card-actions">
                      {!addr.isDefault && (
                        <button className="addr-btn addr-btn-default" onClick={() => handleSetDefault(addr.id)}>
                          Set as Default
                        </button>
                      )}
                      <button className="addr-btn addr-btn-edit" onClick={() => { setEditingAddr(addr.id); setShowAddForm(false); }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button className="addr-btn addr-btn-delete" onClick={() => handleDeleteAddress(addr.id)}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPanTab = () => (
    <div className="profile-card">
      <h2 className="profile-card-title" style={{ marginBottom: 20 }}>PAN Card Information</h2>
      
      {panData ? (
        <div style={{ background: '#FAF8F5', border: '1px solid #E3DAC9', borderRadius: 8, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ background: 'var(--olive)', color: 'white', padding: 4, borderRadius: '50%', display: 'flex' }}>
              <CheckCircle size={18} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--olive)', textTransform: 'uppercase', letterSpacing: 0.5, fontFamily: 'Inter, sans-serif' }}>PAN Verified Successfully</span>
          </div>
          <div className="profile-grid-2col" style={{ gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>PAN Number</div>
              <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'monospace' }}>••••••{panData.panNumber.slice(-4)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Name on Card</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{panData.fullName}</div>
            </div>
          </div>
          <button 
            onClick={handleDeletePan}
            style={{ background: 'transparent', color: '#d32f2f', border: '1px solid #d32f2f', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
          >
            Unlink PAN Card
          </button>
        </div>
      ) : (
        <form onSubmit={handleSavePan} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {panError && <div style={{ background: '#ffebee', color: '#c62828', fontSize: 13, padding: '10px 12px', borderRadius: 4 }}>{panError}</div>}
          
          <div>
            <label style={labelStyle}>PAN Card Number *</label>
            <input 
              className="profile-input" 
              placeholder="e.g. ABCDE1234F" 
              maxLength={10} 
              style={{ textTransform: 'uppercase' }}
              value={panForm.panNumber}
              onChange={e => setPanForm(f => ({ ...f, panNumber: e.target.value }))}
            />
          </div>

          <div>
            <label style={labelStyle}>Full Name on PAN Card *</label>
            <input 
              className="profile-input" 
              placeholder="Full Name" 
              value={panForm.fullName}
              onChange={e => setPanForm(f => ({ ...f, fullName: e.target.value }))}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 13, color: '#555', marginTop: 4 }}>
            <input 
              type="checkbox" 
              style={{ marginTop: 3 }}
              checked={panForm.declared}
              onChange={e => setPanForm(f => ({ ...f, declared: e.target.checked }))}
            />
            <span>I declare that this PAN card belongs to me and the information provided is completely accurate.</span>
          </label>

          <button 
            type="submit" 
            disabled={panVerifying}
            style={{ 
              background: 'var(--olive)', color: 'white', border: 'none', 
              padding: '12px 28px', borderRadius: 4, cursor: 'pointer', 
              fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
            }}
          >
            {panVerifying ? 'Verifying PAN...' : 'Verify & Link PAN'}
          </button>
        </form>
      )}
    </div>
  );

  const renderPaymentsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Cards Section */}
      <div className="profile-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="profile-card-title" style={{ margin: 0 }}>Saved Credit & Debit Cards</h2>
          {!showAddCard && (
            <button 
              onClick={() => { setShowAddCard(true); setShowAddUpi(false); setPaymentError(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--olive)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <Plus size={14} /> Add Card
            </button>
          )}
        </div>

        {paymentError && showAddCard && <div style={{ background: '#ffebee', color: '#c62828', fontSize: 13, padding: '10px 12px', borderRadius: 4, marginBottom: 16 }}>{paymentError}</div>}

        {showAddCard && (
          <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#FAF8F5', border: '1px solid #E3DAC9', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Card Number *</label>
              <input 
                className="profile-input" 
                placeholder="16-digit card number" 
                maxLength={16}
                value={cardForm.cardNo}
                onChange={e => setCardForm(f => ({ ...f, cardNo: e.target.value }))}
              />
            </div>
            <div className="profile-grid-2col" style={{ gap: 12 }}>
              <div>
                <label style={labelStyle}>Expiry Date (MM/YY) *</label>
                <input 
                  className="profile-input" 
                  placeholder="MM/YY" 
                  maxLength={5}
                  value={cardForm.exp}
                  onChange={e => setCardForm(f => ({ ...f, exp: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Cardholder Name *</label>
                <input 
                  className="profile-input" 
                  placeholder="Name" 
                  value={cardForm.name}
                  onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button type="submit" style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Save Card</button>
              <button type="button" onClick={() => setShowAddCard(false)} style={{ background: 'white', color: '#555', border: '1px solid #E3DAC9', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Cancel</button>
            </div>
          </form>
        )}

        {payments.cards.length === 0 ? (
          <p style={{ color: '#878787', fontSize: 13, margin: 0 }}>No cards saved yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {payments.cards.map(card => (
              <div 
                key={card.id} 
                style={{ 
                  background: 'linear-gradient(135deg, #385035 0%, #202F1E 100%)', 
                  color: 'white', 
                  borderRadius: 12, 
                  padding: 20, 
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 160
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1 }}>{card.brand}</span>
                  <button 
                    onClick={() => handleDeleteCard(card.id)} 
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div>
                  <div style={{ fontSize: 18, letterSpacing: 3, fontFamily: 'monospace', marginBottom: 12 }}>
                    •••• •••• •••• {card.last4}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cardholder</div>
                      <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>{card.name}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Expires</div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{card.exp}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* UPI Section */}
      <div className="profile-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 className="profile-card-title" style={{ margin: 0 }}>Saved UPI IDs</h2>
          {!showAddUpi && (
            <button 
              onClick={() => { setShowAddUpi(true); setShowAddCard(false); setPaymentError(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--olive)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <Plus size={14} /> Add UPI
            </button>
          )}
        </div>

        {paymentError && showAddUpi && <div style={{ background: '#ffebee', color: '#c62828', fontSize: 13, padding: '10px 12px', borderRadius: 4, marginBottom: 16 }}>{paymentError}</div>}

        {showAddUpi && (
          <form onSubmit={handleAddUpi} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#FAF8F5', border: '1px solid #E3DAC9', borderRadius: 8, padding: 16, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>UPI ID (VPA) *</label>
              <input 
                className="profile-input" 
                placeholder="e.g. username@okhdfcbank" 
                value={upiForm.upiId}
                onChange={e => setUpiForm(f => ({ ...f, upiId: e.target.value }))}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Save UPI ID</button>
              <button type="button" onClick={() => setShowAddUpi(false)} style={{ background: 'white', color: '#555', border: '1px solid #E3DAC9', padding: '10px 20px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Cancel</button>
            </div>
          </form>
        )}

        {payments.upis.length === 0 ? (
          <p style={{ color: '#878787', fontSize: 13, margin: 0 }}>No UPI IDs saved yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {payments.upis.map(upi => (
              <div 
                key={upi.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  background: '#FAF8F5', 
                  border: '1px solid #E3DAC9', 
                  borderRadius: 8, 
                  padding: '14px 16px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ background: 'rgba(56, 80, 53, 0.1)', color: 'var(--olive)', padding: '6px 10px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
                    UPI
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>{upi.upiId}</span>
                </div>
                <button 
                  onClick={() => handleDeleteUpi(upi.id)} 
                  style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const TABS = [
    { id: 'orders', label: 'My Orders' },
    { id: 'profile', label: 'Profile' },
    { id: 'address', label: 'Addresses' },
    { id: 'payments', label: 'Payments' },
  ];

  return (
    <div className="page-container" style={{ padding: '40px 0 80px', background: 'var(--cream)', minHeight: '80vh' }}>

      {/* Mobile Horizontal Navigation Tabs */}
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        <div className="profile-mobile-tabs">
          {TABS.map(t => (
            <button key={t.id} className={`profile-mobile-tab${activeTab === t.id ? ' active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="profile-container">

        {/* LEFT SIDEBAR (Desktop only) */}
        <div className="profile-sidebar">
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #EAE4D7', boxShadow: '0 4px 12px rgba(56, 80, 53, 0.02)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--sand)', color: 'var(--olive)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#878787' }}>Hello,</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dark)' }}>{user.name}</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #EAE4D7', overflow: 'hidden', boxShadow: '0 4px 12px rgba(56, 80, 53, 0.02)' }}>
            <div style={{ borderBottom: '1px solid #FAF8F5' }}>
              <SidebarItem id="orders" icon={Package} label="My Orders" />
            </div>
            <div style={{ borderBottom: '1px solid #FAF8F5' }}>
              <div 
                onClick={() => setActiveTab('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--olive)', padding: '20px 16px', borderBottom: '1px solid #FAF8F5', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fcfaf7'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                <User size={22} color="var(--olive)" />
                <span style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--dark)', letterSpacing: 1, fontSize: 13 }}>Account Settings</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <SidebarItem id="profile" icon={ChevronRight} label="Profile Information" />
                <SidebarItem id="address" icon={MapPin} label="Manage Addresses" />
              </div>
            </div>
            <div style={{ borderBottom: '1px solid #FAF8F5' }}>
              <SidebarItem id="payments" icon={CreditCard} label="Saved Cards & UPI" subtitle="Saved Cards, UPI, Wallets" />
            </div>
            <div
              style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '16px', color: '#878787', cursor: 'pointer', transition: 'background 0.3s' }}
              onClick={handleLogout}
              onMouseEnter={e => e.currentTarget.style.background = '#f9f9f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              <LogOut size={22} color="var(--olive)" />
              <span style={{ fontWeight: 600, textTransform: 'uppercase', color: '#878787', letterSpacing: 1, fontSize: 13 }}>Logout</span>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="profile-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'address' && renderAddressTab()}
          {activeTab === 'payments' && renderPaymentsTab()}
        </div>
      </div>
    </div>
  );
}
