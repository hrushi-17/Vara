import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const LINKS = ['Home', 'Collections', 'Craftsmanship', 'About', 'Contact'];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar({ onCartOpen, onAuthOpen, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (link) => {
    setMenuOpen(false);
    const id = link.toLowerCase();
    
    if (id === 'home') navigate({ name: 'home' });
    else if (id === 'collections') navigate({ name: 'products' });
    else {
      // Scroll to sections on home page
      navigate({ name: 'home' });
      setTimeout(() => scrollTo(id), 100);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate({ name: 'products', query: search.trim() });
      setSearch('');
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="nav-brand" onClick={() => navigate({ name: 'home' })} style={{ cursor: 'pointer' }}>
            <img src="/images/logo/logo.png" alt="Vara Logo" />
          </div>
          <ul className="nav-links">
            {LINKS.map(l => (
              <li key={l}>
                <a onClick={() => handleNav(l)}>{l}</a>
              </li>
            ))}
          </ul>
          <div className="nav-icons">
            
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="nav-search-form search-desktop" style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--sand)', borderRadius: 20, padding: '6px 16px', transition: 'box-shadow 0.3s' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 200, fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Search size={16} color="var(--sage)" /></button>
            </form>

            {/* Desktop User Panel */}
            <div className="nav-user-desktop">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                  <span onClick={() => navigate({ name: 'profile' })} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, cursor: 'pointer', transition: 'color 0.3s' }} onMouseEnter={e => e.target.style.color='var(--tan)'} onMouseLeave={e => e.target.style.color='inherit'}>
                    <User size={16} /> Hi, {user.name}
                  </span>
                  <button onClick={logout} style={{ background: 'transparent', color: 'var(--rust)', border: '1px solid var(--rust)', padding: '4px 12px', borderRadius: 20, cursor: 'pointer', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', transition: 'all 0.3s' }} onMouseEnter={e => { e.target.style.background = 'var(--rust)'; e.target.style.color = 'white'; }} onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--rust)'; }}>Logout</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: 500 }} onClick={onAuthOpen}>
                  <User size={18} /> Login
                </div>
              )}
            </div>

            {/* Mobile User Icon */}
            <div className="nav-user-mobile" onClick={user ? () => navigate({ name: 'profile' }) : onAuthOpen} style={{ cursor: 'pointer' }}>
              <User size={20} />
            </div>
            
            <div className="cart-wrapper" onClick={onCartOpen} style={{ cursor: 'pointer' }}>
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          
          {/* Mobile Search Bar (wraps below top row) */}
          <div className="search-mobile">
            <form onSubmit={handleSearchSubmit} className="nav-search-form" style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--sand)', borderRadius: 20, padding: '6px 16px', transition: 'box-shadow 0.3s', width: '100%' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Search size={16} color="var(--sage)" /></button>
            </form>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>
          <X size={28} />
        </button>
        {user ? (
          <a onClick={() => { setMenuOpen(false); logout(); }}>Logout ({user.name})</a>
        ) : (
          <a onClick={() => { setMenuOpen(false); onAuthOpen(); }}>Login / Signup</a>
        )}
        {LINKS.map(l => (
          <a key={l} onClick={() => handleNav(l)}>{l}</a>
        ))}
        <a onClick={() => { setMenuOpen(false); onCartOpen(); }}>🛒 Cart ({totalItems})</a>
      </div>
    </>
  );
}
