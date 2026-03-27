import { useState, useEffect } from 'react';
import './styles/globals.css';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Loader from './components/Loader';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import Philosophy from './components/Philosophy';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import Craftsmanship from './components/Craftsmanship';
import Testimonials from './components/Testimonials';
import InstagramGrid from './components/InstagramGrid';
import About from './components/About';
import CorporateGifting from './components/CorporateGifting';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AllProducts from './components/AllProducts';
import ProductDetails from './components/ProductDetails';
import Profile from './components/Profile';

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    const attach = () => document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
    attach();
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs.disconnect(); mo.disconnect(); };
  }, []);
}

// Toast component
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="toast">
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Router state
  const [view, setView] = useState({ name: 'home' }); // { name: 'home' | 'products' | 'product', id?: string, query?: string }

  useScrollReveal();

  useEffect(() => {
    const t1 = setTimeout(() => setLoaderDone(true), 1800);
    const t2 = setTimeout(() => setLoaderHidden(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const showToast = (msg) => {
    setToast(msg);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  const handleAddedToCart = (productName) => {
    showToast(`${productName} added to cart! 🛍️`);
    setCartOpen(true);
  };

  const renderView = () => {
    switch (view.name) {
      case 'profile':
        return <Profile navigate={setView} />;
      case 'product':
        return <ProductDetails productId={view.id} navigate={setView} onAddedToCart={handleAddedToCart} onRequireAuth={() => setAuthOpen(true)} />;
      case 'products':
        return <AllProducts searchQuery={view.query} navigate={setView} onAddedToCart={handleAddedToCart} onRequireAuth={() => setAuthOpen(true)} />;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <MarqueeTicker />
            <Philosophy />
            <Categories onFilter={(filter) => { if (filter !== 'all') setView({ name: 'products', query: filter }) }} />
            <FeaturedProducts
              navigate={setView}
              onAddedToCart={handleAddedToCart}
              onRequireAuth={() => setAuthOpen(true)}
            />
            <Craftsmanship />
            <Testimonials />
            <InstagramGrid />
            <About />
            <CorporateGifting />
            <Contact />
          </>
        );
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        {!loaderHidden && <Loader done={loaderDone} />}

        <AnnouncementBar />
        <Navbar onCartOpen={() => setCartOpen(true)} onAuthOpen={() => setAuthOpen(true)} navigate={setView} />
        
        {renderView()}

        <Footer />
        <BackToTop />

        {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} onRequireAuth={() => { setCartOpen(false); setAuthOpen(true); }} />}
        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
        {toast && <Toast message={toast} onDone={() => setToast(null)} />}
      </CartProvider>
    </AuthProvider>
  );
}
