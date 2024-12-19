import React, { createContext, useState, useEffect, useCallback } from "react";

export interface AuthContextProps {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    if (logoutTimeout) {
      clearTimeout(logoutTimeout);
    }
  }, []);

  const startLogoutTimer = useCallback(() => {
    logoutTimeout = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000); // 30 minutes
  }, [logout]);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("isLoggedIn", "true");
      startLogoutTimer();
    }
    return () => {
      if (logoutTimeout) {
        clearTimeout(logoutTimeout);
      }
    };
  }, [isLoggedIn, startLogoutTimer]);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    startLogoutTimer();
  }, [startLogoutTimer]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

let logoutTimeout: NodeJS.Timeout;

export default AuthProvider;
