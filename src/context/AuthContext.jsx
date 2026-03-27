import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem('vara_active_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const getUsersDB = () => {
    const db = localStorage.getItem('vara_users_db');
    return db ? JSON.parse(db) : [];
  };
  const setUsersDB = (db) => localStorage.setItem('vara_users_db', JSON.stringify(db));

  const login = (email, password) => {
    const db = getUsersDB();
    const existing = db.find(u => u.email === email);
    if (!existing) return 'Account not found. Please sign up.';
    if (existing.password !== password) return 'Incorrect password.';
    
    const active = { name: existing.name, email: existing.email, phone: existing.phone };
    setUser(active);
    localStorage.setItem('vara_active_user', JSON.stringify(active));
    return true;
  };

  const signup = (name, email, phone, password) => {
    const db = getUsersDB();
    if (db.some(u => u.email === email)) return 'Email is already registered.';
    if (db.some(u => u.phone === phone)) return 'Mobile number is already registered.';
    
    const newUser = { name, email, phone, password };
    db.push(newUser);
    setUsersDB(db);

    const active = { name, email, phone };
    setUser(active);
    localStorage.setItem('vara_active_user', JSON.stringify(active));
    return true;
  };

  const updateUser = (newName, newEmail, newPhone) => {
    if (!user) return false;
    let db = getUsersDB();
    let currentRecord = db.find(u => u.email === user.email);
    if (!currentRecord) return false;
    
    // Prevent changing to another registered email/phone
    if (newEmail !== user.email && db.some(u => u.email === newEmail)) return 'Email taken';
    if (newPhone !== user.phone && db.some(u => u.phone === newPhone)) return 'Phone taken';
    
    currentRecord.name = newName;
    currentRecord.email = newEmail;
    currentRecord.phone = newPhone;
    setUsersDB(db);
    
    const active = { name: newName, email: newEmail, phone: newPhone };
    setUser(active);
    localStorage.setItem('vara_active_user', JSON.stringify(active));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vara_active_user');
  };

  const deleteAccount = () => {
    if (!user) return;
    let db = getUsersDB();
    db = db.filter(u => u.email !== user.email);
    setUsersDB(db);
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, deleteAccount, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
