// ─── Local Mock Database for Order History ───────────────
export function saveOrder(userEmail, items, totalAmount, address) {
  try {
    const ordersItem = localStorage.getItem('vara_orders_db');
    const ordersDB = ordersItem ? JSON.parse(ordersItem) : [];
    
    const newOrder = {
      id: 'OD' + Math.floor(Math.random() * 100000000),
      userEmail,
      date: new Date().toISOString(),
      items: Array.isArray(items) ? items : [items],
      total: totalAmount,
      status: 'Placed via WhatsApp',
      address: address || null
    };
    
    ordersDB.push(newOrder);
    localStorage.setItem('vara_orders_db', JSON.stringify(ordersDB));
  } catch (e) {
    console.error('Failed to save order to local DB', e);
  }
}

export function getUserOrders(userEmail) {
  try {
    const ordersItem = localStorage.getItem('vara_orders_db');
    if (!ordersItem) return [];
    const ordersDB = JSON.parse(ordersItem);
    return ordersDB.filter(o => o.userEmail === userEmail).sort((a,b) => new Date(b.date) - new Date(a.date));
  } catch (e) {
    return [];
  }
}

/**
 * Permanently deletes all order history for a given user email.
 * Called on account deletion — corporate standard behaviour:
 * user re-registering with the same email/phone sees an empty order list.
 */
export function deleteUserOrders(userEmail) {
  try {
    const ordersItem = localStorage.getItem('vara_orders_db');
    if (!ordersItem) return;
    const ordersDB = JSON.parse(ordersItem);
    const cleaned = ordersDB.filter(o => o.userEmail !== userEmail);
    localStorage.setItem('vara_orders_db', JSON.stringify(cleaned));
  } catch (e) {
    console.error('Failed to delete user orders', e);
  }
}

export function cancelUserOrder(orderId) {
  try {
    const ordersItem = localStorage.getItem('vara_orders_db');
    if (!ordersItem) return;
    const ordersDB = JSON.parse(ordersItem);
    const cleaned = ordersDB.filter(o => o.id !== orderId);
    localStorage.setItem('vara_orders_db', JSON.stringify(cleaned));
  } catch (e) {
    console.error('Failed to cancel order', e);
  }
}

export function updateOrderStatus(orderId, status) {
  try {
    const ordersItem = localStorage.getItem('vara_orders_db');
    if (!ordersItem) return;
    const ordersDB = JSON.parse(ordersItem);
    const idx = ordersDB.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      ordersDB[idx].status = status;
      localStorage.setItem('vara_orders_db', JSON.stringify(ordersDB));
    }
  } catch (e) {
    console.error('Failed to update order status', e);
  }
}

