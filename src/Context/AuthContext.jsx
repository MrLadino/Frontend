import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

// Obtener la URL base del backend desde la variable de entorno
const apiUrl = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const startTime = Date.now();
    if (token) {
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setAuthenticated(false);
          setUser(null);
        } else {
          setUser({ user_id: decoded.user_id, email: decoded.email, role: decoded.role });
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Error decodificando token:", error);
        localStorage.removeItem("token");
        setAuthenticated(false);
        setUser(null);
      }
    }
    // Asegurar que se muestre el loader por al menos 3 segundos
    const elapsed = Date.now() - startTime;
    const delay = Math.max(3000 - elapsed, 0);
    setTimeout(() => {
      setLoadingAuth(false);
    }, delay);
  }, []);

  const login = async (email, password, role, rememberMe, adminPassword) => {
    try {
      // Se utiliza el endpoint de login centralizado en /api/auth/login
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, adminPassword, rememberMe }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Error en login, response data:", data);
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
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
