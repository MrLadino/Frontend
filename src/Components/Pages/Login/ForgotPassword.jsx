// Frontend/src/Components/Pages/Login/ForgotPassword.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!email) return;

    try {
      const resp = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || "Error al solicitar reset.");
      }
      setMsg(data.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Recuperar Contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Correo asociado a tu cuenta
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {msg && <p className="text-green-500 text-center mb-4">{msg}</p>}
          <button
            type="submit"
            className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Enviar Instrucciones
          </button>
        </form>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full bg-gray-500 text-white p-3 rounded-lg font-semibold hover:bg-gray-600 transition"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
