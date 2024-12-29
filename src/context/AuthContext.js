import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Benutzerinfo (Name, Token)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login-Status

  // Überprüfe SessionStorage bei Seiten-Reload
  useEffect(() => {
    const storedToken = sessionStorage.getItem('customerToken');
    const storedName = sessionStorage.getItem('customerName');

    if (storedToken && storedName) {
      setUser({ name: storedName, token: storedToken });
      setIsLoggedIn(true);
    }
  }, []);

  // Logout-Funktion
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, setUser, setIsLoggedIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
