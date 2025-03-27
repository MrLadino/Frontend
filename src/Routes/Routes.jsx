import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

import Home from "../Components/Pages/Home/Home";
import Login from "../Components/Pages/Login/Login";
import SignUp from "../Components/Pages/SignUp/SignUp";
import IniciarPrograma from "../Components/Pages/IniciarPrograma/IniciarPrograma";
import Caja from "../Components/Pages/Caja/Caja";
import Productos from "../Components/Pages/Productos/Productos";
import Profile from "../Components/Pages/Profile/Profile";
import Ayuda from "../Components/Pages/Ayuda/Ayuda";
import Programa from "../Components/Pages/Programa/Programa";

// Loader
import FancyLoader from "../Components/Commons/FancyLoader";

// Forgot/Reset
import ForgotPassword from "../Components/Pages/Login/ForgotPassword";
import ResetPassword from "../Components/Pages/Login/ResetPassword";

const AppRoutes = () => {
  const { authenticated, loadingAuth, user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Mientras se cargan los datos de autenticación se muestra el loader
  if (loadingAuth) {
    return <FancyLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/login" />} />
      <Route path="/lector-dinamico" element={authenticated ? <Caja /> : <Navigate to="/login" />} />
      <Route path="/productos" element={authenticated ? <Productos /> : <Navigate to="/login" />} />
      <Route path="/profile" element={authenticated ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/ayuda" element={authenticated ? <Ayuda /> : <Navigate to="/login" />} />
      <Route path="/programa" element={authenticated ? <Programa /> : <Navigate to="/login" />} />
      {/* Ruta de publicidad: solo admin; si no, redirige a /programa */}
      <Route
        path="/lector-estatico"
        element={
          authenticated
            ? (isAdmin ? <IniciarPrograma /> : <Navigate to="/programa" />)
            : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
