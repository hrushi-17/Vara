import { useState } from 'react';
import { openWhatsApp, contactFormMessage } from '../utils/whatsapp';
import { WHATSAPP_NUMBER } from '../data/products';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    openWhatsApp(contactFormMessage(form));
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-left reveal-left">
            <h2 className="contact-h2">Get in Touch</h2>
            <p className="contact-body">
              Whether you have a question about a product, need help with sizing,
              or want to discuss a bulk order — we're here.
            </p>
            {[
              { icon: '📍', label: 'Address', val: 'Pune, Maharashtra, India' },
              {
                icon: '📞', label: 'Phone',
                val: <a href={`tel:+${WHATSAPP_NUMBER}`}>+91 88570 94510</a>,
              },
              {
                icon: '💬', label: 'WhatsApp',
                val: <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">+91 88570 94510</a>,
              },
              { icon: '✉', label: 'Email', val: <a href="mailto:Vara.indiaofficial@gmail.com">Vara.indiaofficial@gmail.com</a> },
              { icon: '🕐', label: 'Hours', val: 'Mon–Sat, 10am – 7pm IST' },
            ].map(c => (
              <div className="contact-item" key={c.label}>
                <span className="contact-icon">{c.icon}</span>
                <div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-val">{c.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-right reveal-right">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  className="form-control"
                  name="name"
                  placeholder="Your Name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <select
                  className="form-control"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  <option value="">Select Subject</option>
                  <option>Product Enquiry</option>
                  <option>Bulk / Corporate Order</option>
                  <option>Return / Exchange</option>
                  <option>Custom Engraving</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  className="form-control"
                  name="message"
                  rows={5}
                  placeholder="Your Message *"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn-submit">
                💬 Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
