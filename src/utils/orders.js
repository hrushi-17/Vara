// ─── Local Mock Database for Order History ───────────────
export function saveOrder(userEmail, items, totalAmount) {
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
