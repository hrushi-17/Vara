import { WHATSAPP_NUMBER } from '../data/products';

export function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function buyNowMessage(product, qty, user) {
  const total = (product.price * qty).toLocaleString('en-IN');
  const userDetails = user ? `\n*Name:* ${user.name}\n*Email:* ${user.email}\n*Phone:* ${user.phone || 'N/A'}\n` : '';

  return `Hello Vara! 🛍️${userDetails}
I'd like to order:
• *${product.name}* (${product.type})
  Qty: ${qty} × ₹${product.price.toLocaleString('en-IN')} = *₹${total}*

Please confirm availability and delivery details. Thank you!`;
}

export function cartCheckoutMessage(items, user) {
  const lines = items
    .map(i => `• *${i.name}* × ${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`)
    .join('\n');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const userDetails = user ? `\n*Name:* ${user.name}\n*Email:* ${user.email}\n*Phone:* ${user.phone || 'N/A'}\n` : '';

  return `Hello Vara! 🛍️${userDetails}
I'd like to place an order:

${lines}

*Total: ₹${total.toLocaleString('en-IN')}*

Please confirm my order and share payment/delivery details. Thank you!`;
}

export function corporateQuoteMessage() {
  return `Hello Vara! 🏢

I'm interested in a *Corporate/Bulk Order* for leather bags.

Could you please share:
• Volume discount details
• Custom engraving options
• Branded packaging info
• Minimum order quantity

Looking forward to hearing from you!`;
}

export function contactFormMessage({ name, email, phone, subject, message }) {
  return `Hello Vara! 📩

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone}
*Subject:* ${subject}

*Message:*
${message}`;
}
