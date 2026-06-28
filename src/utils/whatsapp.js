import { WHATSAPP_NUMBER } from '../data/products';
import { getDefaultAddress } from './addresses';

export function openWhatsApp(message) {
  // Dispatch custom event to show the premium redirection modal in App.jsx
  const event = new CustomEvent('trigger-whatsapp-modal', { detail: { message } });
  window.dispatchEvent(event);
}

export function buyNowMessage(product, qty, user, address) {
  const total = (product.price * qty).toLocaleString('en-IN');
  const userDetails = user ? `\n*Name:* ${user.name}\n*Email:* ${user.email}\n*Phone:* ${user.phone || 'N/A'}\n` : '';
  const addrBlock = (address && user)
    ? `\n*Delivery Address:*\n${user.name}\n${address.line1}\n${address.city}, ${address.state} - ${address.pincode}\n*Phone:* ${user.phone}\n`
    : '';

  return `Hello Vara! 🛍️${userDetails}${addrBlock}
I'd like to order:
• *${product.name}* (${product.type})
  Qty: ${qty} × ₹${product.price.toLocaleString('en-IN')} = *₹${total}*

Please confirm availability and delivery details. Thank you!`;
}

export function cartCheckoutMessage(items, user, address, paymentDetails) {
  const lines = items
    .map(i => `• *${i.name}* × ${i.qty} = ₹${(i.price * i.qty).toLocaleString('en-IN')}`)
    .join('\n');
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const userDetails = user ? `\n*Name:* ${user.name}\n*Email:* ${user.email}\n*Phone:* ${user.phone || 'N/A'}\n` : '';
  const addrBlock = (address && user)
    ? `\n*Delivery Address:*\n${user.name}\n${address.line1}\n${address.city}, ${address.state} - ${address.pincode}\n*Phone:* ${user.phone}\n`
    : '';

  const payBlock = paymentDetails
    ? `\n*Payment Method:* ${paymentDetails}\n`
    : '';

  return `Hello Vara! 🛍️${userDetails}${addrBlock}${payBlock}
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

export function cancelOrderMessage(order, user) {
  const dateFormatted = new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const itemsList = order.items.map(i => `• *${i.name}* (Qty: ${i.qty})`).join('\n');
  const userDetails = user ? `\n*Name:* ${user.name}\n*Email:* ${user.email}\n*Phone:* ${user.phone}\n` : '';
  
  const address = order.address || (user ? getDefaultAddress(user.email) : null);
  const addrBlock = (address && user)
    ? `\n*Delivery Address:*\n${user.name}\n${address.line1}\n${address.city}, ${address.state} - ${address.pincode}\n*Phone:* ${user.phone}\n`
    : '';

  return `Hello Vara! 🚨
I'd like to *CANCEL* my order. 

*Order Details:*
*Order ID:* ${order.id}
*Order Date:* ${dateFormatted}
*Total Amount:* ₹${order.total.toLocaleString('en-IN')}
${userDetails}${addrBlock}
*Items:*
${itemsList}

Please cancel this order and confirm. Thank you!`;
}
