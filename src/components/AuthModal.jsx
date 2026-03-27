import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Eye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => setFormData(f => ({ ...f, [e.target.name]: e.target.value }));

  // Regex: min 8 chars, at least 1 letter, 1 number
  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (!formData.name) return setError('Full Name is required');
      if (!formData.phone) return setError('Mobile Number is required');
      if (!passRegex.test(formData.password)) {
        return setError('Password must be at least 8 chars with 1 letter and 1 number');
      }
      const res = signup(formData.name, formData.email, formData.phone, formData.password);
      if (res !== true) return setError(res);
    } else {
      if (!formData.email || !formData.password) return setError('Email and Password are required');
      const res = login(formData.email, formData.password);
      if (res !== true) return setError(res);
    }
    
    // reset & close
    setFormData({ name: '', email: '', phone: '', password: '' });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>×</button>
        
        <div className="auth-left">
          <h2 className="auth-title">{isLogin ? 'Login' : 'Looks like you\'re new here!'}</h2>
          <p className="auth-sub">{isLogin ? 'Get access to your Orders, Wishlist and Recommendations' : 'Sign up with your details to get started'}</p>
          <div style={{ marginTop: 'auto', textAlign: 'center' }}>
            <img src="/images/LB1/1.5.jpg" alt="Vara Login" className="auth-img" />
          </div>
        </div>

        <div className="auth-right">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="auth-group">
                  <input type="text" name="name" className="auth-input" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="auth-group">
                  <input type="tel" name="phone" className="auth-input" placeholder="Mobile / WhatsApp Number" value={formData.phone} onChange={handleChange} required />
                </div>
              </>
            )}
            <div className="auth-group">
              <input type="email" name="email" className="auth-input" placeholder="Enter Email" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="auth-group auth-pass-wrap">
              <input 
                type={showPass ? 'text' : 'password'} 
                name="password" 
                className="auth-input" 
                placeholder="Enter Password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {error && <div className="auth-error">{error}</div>}
            
            {isLogin && <p className="auth-terms">By continuing, you agree to Vara's Terms of Use and Privacy Policy.</p>}
            
            <button type="submit" className="auth-submit">
              {isLogin ? 'Login' : 'Continue'}
            </button>
            
            <button type="button" className="auth-toggle" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'New to Vara? Create an account' : 'Existing User? Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
