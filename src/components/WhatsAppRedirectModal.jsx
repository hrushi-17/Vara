import { X, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WHATSAPP_NUMBER } from '../data/products';

export default function WhatsAppRedirectModal({ isOpen, onClose, message }) {
  const [copied, setCopied] = useState(false);
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (isOpen && message) {
      try {
        navigator.clipboard.writeText(message);
        setCopied(true);
        const t = setTimeout(() => setCopied(false), 3000);
        return () => clearTimeout(t);
      } catch (e) {
        console.error("Auto-copy failed", e);
      }
    }
  }, [isOpen, message]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
  const whatsappAppUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;

  return (
    <>
      <div className="cart-overlay" onClick={onClose} style={{ zIndex: 10001 }} />
      <div
        className="modal-box"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '380px',
          background: '#FBFBF9', // --cream
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          zIndex: 10002,
          padding: '20px',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          border: '1px solid #E8E2D5', // soft sand outline
          fontFamily: 'Inter, sans-serif'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'var(--olive)', color: '#FBFBF9', padding: 6, borderRadius: '50%', display: 'flex' }}>
              <MessageSquare size={16} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', color: 'var(--dark)' }}>
              Order Details Ready
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Info */}
        <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.4, margin: '0 0 12px' }}>
          {isMobile 
            ? "We have copied your order summary. Tap the button below to open WhatsApp and send your order."
            : "We have copied your order summary to your clipboard. Since you are on desktop, you can send it via WhatsApp Web or the app."
          }
        </p>

        {/* Message preview area (smaller, more compact) */}
        <div style={{ background: '#F4EFE6', border: '1px solid #E3DAC9', borderRadius: 6, padding: '8px 10px', marginBottom: 16, maxHeight: '110px', overflowY: 'auto' }}>
          <pre style={{ margin: 0, fontSize: '11px', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: '#444', lineHeight: 1.3 }}>
            {message}
          </pre>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: copied ? '#E4ECD5' : '#EAE4D7', // --sand variant
              color: copied ? '#385035' : '#4E443C',
              border: `1px solid ${copied ? '#B2C69B' : '#D0C3B1'}`,
              padding: '10px', borderRadius: 6, cursor: 'pointer', fontSize: '12px', fontWeight: 600,
              transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
          </button>

          {isMobile ? (
            /* Mobile Link: Uses wa.me which intercepts cleanly on iOS/Android to open native app */
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#25D366', color: 'white', textDecoration: 'none',
                padding: '12px', borderRadius: 6, fontSize: '13px', fontWeight: 700,
                textAlign: 'center', transition: 'background 0.2s', fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.2)'
              }}
            >
              <MessageSquare size={15} />
              Open WhatsApp App
            </a>
          ) : (
            <>
              {/* Desktop Option 1: Web WhatsApp */}
              <a
                href={`https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: 'var(--olive)', color: '#FBFBF9', textDecoration: 'none',
                  padding: '10px', borderRadius: 6, fontSize: '12px', fontWeight: 700,
                  textAlign: 'center', transition: 'background 0.2s', fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 2px 6px rgba(56,80,53,0.15)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#2C3E29'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--olive)'}
              >
                <ExternalLink size={14} />
                Open WhatsApp Web
              </a>

              {/* Desktop Option 2: wa.me prompts Desktop Application launch */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: '#FBFBF9', color: 'var(--olive)', textDecoration: 'none',
                  border: '1px solid var(--olive)',
                  padding: '10px', borderRadius: 6, fontSize: '12px', fontWeight: 600,
                  textAlign: 'center', transition: 'all 0.2s', fontFamily: 'Inter, sans-serif'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EAE4D7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FBFBF9'; }}
              >
                Open in WhatsApp App
              </a>
            </>
          )}
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: '10px', color: '#999', letterSpacing: 0.5 }}>
          Admin Number: +{WHATSAPP_NUMBER}
        </div>
      </div>
    </>
  );
}
