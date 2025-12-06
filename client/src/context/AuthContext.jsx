import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    api.auth
      .me(token)
      .then((u) => setUser(u))
      .catch(() => {
        setToken(null);
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    const { token: tk } = await api.auth.login(email, password);
    localStorage.setItem("token", tk);
    setToken(tk);
    const me = await api.auth.me(tk);
    setUser(me);
    return me;
  };

  const register = async (firstName, lastName, email, password, confirmPassword) => {
    setError(null);
    const { token: tk } = await api.auth.register(firstName, lastName, email, password, confirmPassword);
    localStorage.setItem("token", tk);
    setToken(tk);
    const me = await api.auth.me(tk);
    setUser(me);
    return me;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, error, setError, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
