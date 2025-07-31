import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [name, setName] = useState(localStorage.getItem("authName") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  useEffect(() => {
    if (name) {
      localStorage.setItem("authName", name);
    } else {
      localStorage.removeItem("authName");
    }
  }, [name]);

  const login = (token, name) => {
    setToken(token);
    setName(name);
  };

  const logout = () => {
    setToken(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, name, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
