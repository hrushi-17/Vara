import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Offcanvas from 'react-bootstrap/Offcanvas';

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
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={`navbar top-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="nav-mobile-left d-md-none me-2">
            <button className="hamburger" onClick={() => setMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
          
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
          <div className="nav-icons" style={{ display: 'flex', alignItems: 'center' }}>
            
            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="nav-search-form d-none d-md-flex" style={{ alignItems: 'center', background: 'white', border: '1px solid var(--sand)', borderRadius: 20, padding: '6px 16px', transition: 'box-shadow 0.3s' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: 200, fontFamily: 'Inter, sans-serif' }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Search size={16} color="var(--sage)" /></button>
            </form>

            <div className="nav-user-desktop d-none d-md-flex ms-3">
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
            <div className="d-flex d-md-none align-items-center ms-auto me-3" onClick={user ? () => navigate({ name: 'profile' }) : onAuthOpen} style={{ cursor: 'pointer' }}>
               <User size={22} color="var(--tan)" />
            </div>

            <div className="cart-wrapper ms-md-3" onClick={onCartOpen} style={{ cursor: 'pointer' }}>
              <ShoppingBag size={22} color="var(--tan)" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
          </div>
        </div>
        
        {/* Mobile Full-Width Search Bar */}
        <div className="nav-search-mobile d-md-none w-100 px-3 pb-2 pt-1">
          <form onSubmit={handleSearchSubmit} className="w-100 d-flex" style={{ background: 'white', border: '1px solid var(--sand)', borderRadius: 24, padding: '8px 16px' }}>
            <input 
              type="text" 
              placeholder="Search vara essentials..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', fontFamily: 'Inter, sans-serif' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Search size={18} color="var(--sage)" /></button>
          </form>
        </div>
      </nav>

      {/* React Bootstrap Offcanvas Sidebar */}
      <Offcanvas show={menuOpen} onHide={() => setMenuOpen(false)} placement="start" className="mobile-offcanvas">
        <Offcanvas.Header closeButton className="pb-0" closeVariant="white">
          <Offcanvas.Title>
            <div className="nav-brand" onClick={() => handleNav('home')} style={{ cursor: 'pointer' }}>
              <img src="/images/logo/logo.png" alt="Vara Logo" style={{ height: '36px' }} />
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column gap-3 pt-4">
          {user ? (
            <div className="mb-3 d-flex flex-column gap-2 border-bottom border-light pb-3">
              <span className="text-white fw-bold fs-5">Hi, {user.name}</span>
              <a className="text-white text-decoration-none nav-menu-link" onClick={() => { setMenuOpen(false); navigate({ name: 'profile' }); }}>View Profile</a>
              <a className="text-white text-decoration-none nav-menu-link text-uppercase mt-2" style={{ fontSize: '13px', color: 'var(--rust) !important' }} onClick={() => { setMenuOpen(false); logout(); }}>Logout</a>
            </div>
          ) : (
            <div className="mb-3 border-bottom border-light pb-3">
              <a className="text-white text-decoration-none fw-bold fs-5 d-flex align-items-center gap-2 nav-menu-link" onClick={() => { setMenuOpen(false); onAuthOpen(); }}>
                <User size={20} /> Login / Signup
              </a>
            </div>
          )}
          
          <div className="d-flex flex-column gap-4 nav-menu-links">
            {LINKS.map(l => (
              <a key={l} className="text-decoration-none text-white nav-menu-link" onClick={() => handleNav(l)}>{l}</a>
            ))}
          </div>
          
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
