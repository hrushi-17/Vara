import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { User, LogOut, ShieldAlert, ChevronRight, Package, CreditCard, Lock, MapPin } from 'lucide-react';
import { getUserOrders } from '../utils/orders';

export default function Profile({ navigate }) {
  const { user, deleteAccount, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '' });
  const [editError, setEditError] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      setEditForm({ name: user.name, email: user.email, phone: user.phone });
      setOrders(getUserOrders(user.email));
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      deleteAccount();
      navigate({ name: 'home' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate({ name: 'home' });
  };

  const handleSaveProfile = () => {
    setEditError('');
    if (!editForm.name || !editForm.email || !editForm.phone) {
      setEditError('All fields are required.');
      return;
    }
    const res = updateUser(editForm.name, editForm.email, editForm.phone);
    if (res !== true) {
      setEditError(res);
      return;
    }
    setIsEditing(false);
  };

  const SidebarItem = ({ id, icon: Icon, label, subtitle }) => {
    const isActive = activeTab === id;
    return (
      <div 
        style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '16px', color: isActive ? 'var(--olive)' : '#878787', cursor: 'pointer', transition: 'background 0.3s', background: isActive ? 'rgba(213,203,176,0.1)' : 'transparent' }}
        onClick={() => setActiveTab(id)}
        onMouseEnter={e => !isActive && (e.currentTarget.style.background = '#f9f9f9')}
        onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
      >
        <Icon size={22} color={isActive ? 'var(--olive)' : '#878787'} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, textTransform: 'uppercase', color: isActive ? 'var(--olive)' : '#878787', letterSpacing: 1, fontSize: 13 }}>{label}</div>
          {subtitle && <div style={{ fontSize: 11, marginTop: 4, color: '#999' }}>{subtitle}</div>}
        </div>
        <ChevronRight size={16} />
      </div>
    );
  };

  // ---------------- Right Panels ----------------

  const renderProfileTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ background: 'white', padding: '32px 40px', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#212121', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          Personal Information
          {!isEditing && <span onClick={() => setIsEditing(true)} style={{ fontSize: 14, color: 'var(--rust)', fontWeight: 500, cursor: 'pointer' }}>Edit</span>}
          {isEditing && <span onClick={() => setIsEditing(false)} style={{ fontSize: 14, color: '#878787', fontWeight: 500, cursor: 'pointer', marginLeft: 'auto' }}>Cancel</span>}
        </h2>

        {editError && <div style={{ color: 'red', fontSize: 13, marginBottom: 16 }}>{editError}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, marginBottom: 40, maxWidth: 400 }}>
          <div>
            <div style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>Full Name</div>
            <input 
              type="text" 
              value={isEditing ? editForm.name : user.name} 
              onChange={e => setEditForm({...editForm, name: e.target.value})}
              disabled={!isEditing} 
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: 2, background: isEditing ? 'white' : '#fafafa', color: isEditing ? '#212121':'#878787', fontSize: 14, outline: 'none' }}
            />
          </div>
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#212121', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          Account Credentials
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>Email Address</div>
            <input 
              type="email" 
              value={isEditing ? editForm.email : user.email} 
              onChange={e => setEditForm({...editForm, email: e.target.value})}
              disabled={!isEditing} 
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: 2, background: isEditing ? 'white' : '#fafafa', color: isEditing ? '#212121':'#878787', fontSize: 14, outline: 'none' }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: '#878787', marginBottom: 8 }}>Mobile / WhatsApp</div>
            <input 
              type="text" 
              value={isEditing ? editForm.phone : user.phone} 
              onChange={e => setEditForm({...editForm, phone: e.target.value})}
              disabled={!isEditing} 
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: 2, background: isEditing ? 'white' : '#fafafa', color: isEditing ? '#212121':'#878787', fontSize: 14, outline: 'none' }}
            />
          </div>
        </div>

        {isEditing && (
          <button onClick={handleSaveProfile} style={{ background: 'var(--olive)', color: 'white', border: 'none', padding: '14px 32px', borderRadius: 2, cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
            Save Changes
          </button>
        )}
      </div>

      <div style={{ background: 'white', padding: '32px 40px', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#d32f2f', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <ShieldAlert size={22} />
          Danger Zone
        </h2>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 32, lineHeight: 1.6, maxWidth: 650 }}>
          Deleting your account will permanently remove your personal information, saved addresses, and order history from Vara. 
          You can re-register with the same email and mobile number later if you choose to return.
        </p>
        <button 
          onClick={handleDelete} 
          style={{ background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', padding: '14px 32px', borderRadius: 2, cursor: 'pointer', fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, transition: 'all 0.3s' }}
          onMouseEnter={e => { e.target.style.background = '#ffebee' }}
          onMouseLeave={e => { e.target.style.background = '#fff' }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div style={{ background: 'white', padding: '32px 40px', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', minHeight: 400 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, color: '#212121', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>My Orders</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#878787' }}>
          <Package size={64} color="#e0e0e0" style={{ marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, color: '#212121', marginBottom: 8 }}>No orders found</h3>
          <p>Looks like you haven't placed any orders yet.</p>
          <button style={{ marginTop: 24, background: 'var(--olive)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 2, cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase' }} onClick={() => navigate({ name: 'products' })}>Shop Now</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                <div>
                  <div style={{ fontSize: 12, color: '#878787', marginBottom: 4 }}>ORDER PLACED</div>
                  <div style={{ fontSize: 14, color: '#212121', fontWeight: 500 }}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#878787', marginBottom: 4 }}>TOTAL</div>
                  <div style={{ fontSize: 14, color: '#212121', fontWeight: 500 }}>₹{order.total.toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#878787', marginBottom: 4 }}>ORDER #</div>
                  <div style={{ fontSize: 14, color: '#212121', fontWeight: 500 }}>{order.id}</div>
                </div>
              </div>
              
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: idx !== order.items.length-1 ? 16 : 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4, border: '1px solid #e0e0e0' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--olive)', marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: '#878787' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ width: 140 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--olive)' }}>Status</div>
                    <div style={{ fontSize: 13, color: '#4caf50', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4caf50' }} />
                      {order.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderPlaceholder = (title, icon, subtitle) => (
    <div style={{ background: 'white', padding: '32px 40px', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#212121', marginTop: 24, marginBottom: 8 }}>{title}</h2>
      <p style={{ color: '#878787', textAlign: 'center', maxWidth: 400 }}>{subtitle}</p>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '40px 0 80px', background: '#f1f3f6', minHeight: '80vh' }}>
      <div className="container" style={{ display: 'flex', gap: '16px', maxWidth: '1100px', alignItems: 'flex-start', margin: '0 auto', padding: '0 24px' }}>
        
        {/* LEFT SIDEBAR */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', padding: '16px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--sand)', color: 'var(--olive)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '12px', color: '#878787' }}>Hello,</div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--dark)' }}>{user.name}</div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ borderBottom: '1px solid #f0f0f0' }}>
              <SidebarItem id="orders" icon={Package} label="My Orders" />
            </div>

            <div style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#878787', padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <User size={22} color="var(--olive)" />
                <span style={{ fontWeight: 600, textTransform: 'uppercase', color: '#878787', letterSpacing: 1, fontSize: 13 }}>Account Settings</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <SidebarItem id="profile" icon={ChevronRight} label="Profile Information" />
                <SidebarItem id="address" icon={MapPin} label="Manage Addresses" />
                <SidebarItem id="pan" icon={Lock} label="PAN Card Information" />
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #f0f0f0' }}>
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
        <div style={{ flex: 1 }}>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'address' && renderPlaceholder('Manage Addresses', <MapPin size={64} color="#e0e0e0" />, 'Save your addresses for a faster checkout experience.')}
          {activeTab === 'pan' && renderPlaceholder('PAN Card Information', <Lock size={64} color="#e0e0e0" />, 'Add your PAN card details to complete high-value transactions.')}
          {activeTab === 'payments' && renderPlaceholder('Saved Payment Methods', <CreditCard size={64} color="#e0e0e0" />, 'Securely save your credit/debit cards and UPI IDs.')}
        </div>
      </div>
    </div>
  );
}
