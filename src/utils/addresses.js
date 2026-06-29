// ─── Address Management ───────────────────────────────────
const KEY = 'vara_addresses_db';

function getAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function saveAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getUserAddresses(userEmail) {
  return getAll().filter(a => a.userEmail === userEmail);
}

export function addAddress(userEmail, address) {
  const all = getAll();
  const userAddrs = all.filter(a => a.userEmail === userEmail);
  const newAddr = {
    id: 'ADDR' + Date.now(),
    userEmail,
    ...address,
    isDefault: userAddrs.length === 0, // first address is auto default
  };
  saveAll([...all, newAddr]);
  return newAddr;
}

export function updateAddress(id, updates) {
  const all = getAll();
  const idx = all.findIndex(a => a.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...updates };
  saveAll(all);
}

export function deleteAddress(id) {
  let all = getAll();
  const deleted = all.find(a => a.id === id);
  all = all.filter(a => a.id !== id);
  // If deleted was default, make first remaining address of that user default
  if (deleted?.isDefault) {
    const firstRemaining = all.find(a => a.userEmail === deleted.userEmail);
    if (firstRemaining) firstRemaining.isDefault = true;
  }
  saveAll(all);
}

export function setDefaultAddress(id, userEmail) {
  const all = getAll();
  all.forEach(a => {
    if (a.userEmail === userEmail) a.isDefault = (a.id === id);
  });
  saveAll(all);
}

export function getDefaultAddress(userEmail) {
  const addrs = getUserAddresses(userEmail);
  return addrs.find(a => a.isDefault) || addrs[0] || null;
}

export function deleteUserAddresses(userEmail) {
  const all = getAll().filter(a => a.userEmail !== userEmail);
  saveAll(all);
}
