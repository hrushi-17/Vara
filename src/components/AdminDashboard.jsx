import { useState, useEffect } from 'react';
import { ShieldCheck, LogOut, Package, RefreshCw, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cancelUserOrder, updateOrderStatus } from '../utils/orders';

export default function AdminDashboard({ navigate }) {
  const [pin, setPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [orders, setOrders] = useState([]);

  // Load orders
  const loadOrders = () => {
    try {
      const ordersDB = JSON.parse(localStorage.getItem('vara_orders_db') || '[]');
      // Sort newest first
      ordersDB.sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(ordersDB);
    } catch (e) {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === 'admin123') {
      setIsAdmin(true);
      setPinError('');
    } else {
      setPinError('Incorrect Admin PIN. Please try again.');
    }
  };

  const handleApproveCancel = (orderId) => {
    if (window.confirm("Approve cancellation request? This will permanently delete/cancel this order from the system database.")) {
      cancelUserOrder(orderId);
      loadOrders();
    }
  };

  const handleRejectCancel = (orderId) => {
    if (window.confirm("Reject cancellation request? The order status will revert to 'Placed via WhatsApp' and remain active.")) {
      updateOrderStatus(orderId, 'Placed via WhatsApp');
      loadOrders();
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setPin('');
  };

  if (!isAdmin) {
    return (
      <div className="page-container" style={{ padding: '160px 0', background: 'var(--cream)', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', padding: '32px 40px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ background: 'var(--sand)', color: 'var(--olive)', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, marginBottom: 8, color: 'var(--dark)' }}>Admin Portal</h2>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 24 }}>Enter PIN code to manage orders and cancellation requests.</p>
          
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Enter PIN (admin123)" 
              value={pin} 
              onChange={e => setPin(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 15, marginBottom: 12, textAlign: 'center', boxSizing: 'border-box', outline: 'none' }}
              autoFocus
            />
            {pinError && <div style={{ color: 'red', fontSize: 13, marginBottom: 12 }}>{pinError}</div>}
            
            <button 
              type="submit" 
              className="btn-tan" 
              style={{ width: '100%', padding: '12px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
            >
              Access Dashboard
            </button>
          </form>
          <button 
            onClick={() => navigate({ name: 'home' })} 
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 13, marginTop: 16, textDecoration: 'underline' }}
          >
            Cancel & Go Home
          </button>
        </div>
      </div>
    );
  }

  const pendingRequests = orders.filter(o => o.status === 'Cancellation Requested').length;

  return (
    <div className="page-container" style={{ padding: '100px 0 60px', background: '#f1f3f6', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 16px' }}>
        
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--olive)', color: 'white', padding: '16px 24px', borderRadius: '4px', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldCheck size={24} /> Varavee Operations Dashboard
            </h1>
            <p style={{ fontSize: 12, opacity: 0.8, margin: '4px 0 0' }}>Security Access Level: Admin Controller</p>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="profile-grid-2col" style={{ marginBottom: 24 }}>
          <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(56,80,53,0.1)', color: 'var(--olive)', padding: 12, borderRadius: '50%' }}>
              <Package size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#888' }}>Total Orders Recorded</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#212121' }}>{orders.length}</div>
            </div>
          </div>
          <div className="profile-card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: pendingRequests > 0 ? '4px solid #f57c00' : 'none' }}>
            <div style={{ background: pendingRequests > 0 ? '#fff3e0' : 'rgba(0,0,0,0.05)', color: pendingRequests > 0 ? '#f57c00' : '#888', padding: 12, borderRadius: '50%' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: '#888' }}>Pending Cancellations</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: pendingRequests > 0 ? '#f57c00' : '#212121' }}>{pendingRequests}</div>
            </div>
          </div>
        </div>

        {/* Orders Table/Cards */}
        <div className="profile-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#212121', margin: 0 }}>All System Orders</h2>
            <button onClick={loadOrders} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #ddd', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 13, color: '#666' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              <Package size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
              <p>No orders found in the local system database.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    <th style={{ padding: '12px 8px' }}>Order Details</th>
                    <th style={{ padding: '12px 8px' }}>Items</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const isPending = order.status === 'Cancellation Requested';
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                        {/* Details */}
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--olive)' }}>{order.id}</div>
                          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{order.userEmail}</div>
                          <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>
                            {new Date(order.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        {/* Items */}
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {order.items.map((it, idx) => (
                              <div key={idx} style={{ fontSize: 13, color: '#333' }}>
                                • {it.name} <span style={{ color: '#888' }}>(Qty: {it.qty})</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 600, marginTop: 6, color: '#111' }}>
                            Total: ₹{order.total.toLocaleString('en-IN')}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 8px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: isPending ? '#fff3e0' : '#e8f5e9',
                            color: isPending ? '#e65100' : '#2e7d32'
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isPending ? '#e65100' : '#2e7d32' }} />
                            {order.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                          {isPending ? (
                            <div style={{ display: 'inline-flex', gap: 8 }}>
                              <button
                                onClick={() => handleApproveCancel(order.id)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 4,
                                  background: '#d32f2f', color: 'white', border: 'none',
                                  padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                                  fontSize: 12, fontWeight: 600
                                }}
                              >
                                <CheckCircle size={14} /> Approve Cancel
                              </button>
                              <button
                                onClick={() => handleRejectCancel(order.id)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 4,
                                  background: 'white', color: '#666', border: '1px solid #ccc',
                                  padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                                  fontSize: 12, fontWeight: 600
                                }}
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: '#999' }}>No Actions Required</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
