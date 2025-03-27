// Frontend/src/Routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const AdminRoute = ({ children }) => {
  const { authenticated, user } = useAuth();

  // Si no está autenticado, redirige a /login
  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado pero no es admin, redirige a /home
  if (user?.role !== "admin") {
    return <Navigate to="/home" />;
  }

  // Si es admin, renderiza los children
  return children;
};

export default AdminRoute;
