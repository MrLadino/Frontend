import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

// Usamos la variable de entorno para la URL base del backend
const apiUrl = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const startTime = Date.now();
      if (token) {
        try {
          const decoded = jwt_decode(token);
          if (decoded.exp * 1000 < Date.now()) {
            logout();
          } else {
            setUser({ user_id: decoded.user_id, email: decoded.email, role: decoded.role });
            setAuthenticated(true);
          }
        } catch (error) {
          console.error("Error decodificando token:", error);
          logout();
        }
      }
      const elapsed = Date.now() - startTime;
      const delay = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoadingAuth(false), delay);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role, rememberMe, adminPassword) => {
    try {
      // Usar el endpoint actualizado: /api/login
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, adminPassword, rememberMe }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }
      localStorage.setItem("token", data.token);
      const decoded = jwt_decode(data.token);
      setUser({ user_id: decoded.user_id, email: decoded.email, role: decoded.role });
      setAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error en login:", error?.message || error);
      throw new Error(error?.message || "Error desconocido al iniciar sesión");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  const verifySession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/verify`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
        credentials: "include",
      });
      return response.ok;
    } catch (error) {
      console.error("Session verification error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, loadingAuth, verifySession }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
