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
          <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            
            <form onSubmit={handleSearchSubmit} className="nav-search-form" style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid var(--sand)', borderRadius: 20, padding: '6px 16px', transition: 'box-shadow 0.3s' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 200, fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Search size={16} color="var(--sage)" /></button>
            </form>

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
            
            <div className="cart-wrapper" onClick={onCartOpen} style={{ cursor: 'pointer' }}>
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
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
