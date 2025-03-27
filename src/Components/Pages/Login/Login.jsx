// Frontend/src/Pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import logo from "../../../assets/Logo.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // "error" o "success"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage("");
    setAlertType("");
    setIsLoading(true);

    if (!email || !password || !role) {
      setAlertMessage("Correo, contraseña y rol son obligatorios.");
      setAlertType("error");
      setIsLoading(false);
      return;
    }

    if (role === "admin" && adminPassword.trim() === "") {
      setAlertMessage("Debes ingresar la contraseña de admin.");
      setAlertType("error");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(email, password, role, rememberMe, adminPassword);
      if (success) {
        setAlertMessage("Inicio de sesión exitoso. Bienvenido a Tic America.");
        setAlertType("success");
        navigate("/home");
      }
    } catch (error) {
      setAlertMessage(error.message);
      setAlertType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-black to-red-600">
      <div
        className="bg-white w-full max-w-md p-6 rounded-xl
                   transform scale-[0.8] origin-center transition-all duration-500
                   hover:scale-[0.83] shadow-[0_0_15px_5px_rgba(255,255,255,0.4)]"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Logo de Tic America" className="w-24 h-24 mx-auto" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Bienvenido a Tic America
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Ingresa tus credenciales para continuar.
        </p>

        {alertMessage && (
          <div className={`text-center mb-4 px-4 py-2 rounded ${alertType === "error" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"}`}>
            {alertMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Correo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Selección de Rol */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Contraseña de Admin (solo para rol admin) */}
          {role === "admin" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Contraseña de Admin</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-md 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-300"
                placeholder="Ingresa la contraseña de admin"
                required
              />
            </div>
          )}

          {/* Recuérdame y enlace para recuperar contraseña */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
              />
              <span className="ml-2">Recuérdame</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-red-500 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-white font-semibold transition duration-300 ${
              isLoading ? "bg-red-300 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link to="/signup" className="text-red-500 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
