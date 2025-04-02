import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Usamos HashRouter en lugar de BrowserRouter
import { HashRouter } from "react-router-dom";
import AuthProvider from "./Context/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </StrictMode>
);
