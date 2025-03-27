// Frontend/src/Components/Pages/Login/ResetPassword.jsx

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Token no proporcionado.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!token) {
      setError("Falta el token.");
      return;
    }
    if (newPassword !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const resp = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.message || "Error al resetear contraseña.");
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
          Restablecer Contraseña
        </h2>
        {!token && (
          <p className="text-red-500 text-center mb-4">
            No se encontró un token válido.
          </p>
        )}
        {token && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {msg && <p className="text-green-500 text-center mb-4">{msg}</p>}
            <button
              type="submit"
              className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Restablecer
            </button>
          </form>
        )}
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

export default ResetPassword;
