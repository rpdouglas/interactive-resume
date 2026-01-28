import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 🔓 MOCK USER: Always logged in
  const user = { 
    uid: 'dev-admin', 
    email: 'admin@ryandouglas.com', 
    displayName: 'Ryan Douglas (Dev)' 
  };

  return (
    <AuthContext.Provider value={{ user, login: () => {}, logout: () => {}, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
};
