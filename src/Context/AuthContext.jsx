import React, { createContext, useContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const apiUrl = "https://backend-production-18aa.up.railway.app/";

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
            await handleLogout();
          } else {
            setUser({
              user_id: decoded.user_id,
              email: decoded.email,
              role: decoded.role,
            });
            setAuthenticated(true);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          await handleLogout();
        }
      }
      
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(1000 - elapsed, 0);
      setTimeout(() => setLoadingAuth(false), remainingDelay);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role, rememberMe, adminPassword) => {
    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role, adminPassword, rememberMe }),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Authentication failed");
      }
      
      const data = await response.json();
      localStorage.setItem("token", data.token);
      
      const decoded = jwt_decode(data.token);
      setUser({
        user_id: decoded.user_id,
        email: decoded.email,
        role: decoded.role,
      });
      setAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.message || "Could not connect to server");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiUrl}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      setAuthenticated(false);
      setUser(null);
      navigate("/login");
    }
  };

  const verifySession = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/api/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      
      return response.ok;
    } catch (error) {
      console.error("Session verification error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      authenticated, 
      user, 
      login, 
      logout: handleLogout, 
      loadingAuth,
      verifySession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
