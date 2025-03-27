import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../../assets/Logo.png";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    adminPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: "", type: "" });

    const { email, password, confirmPassword, role, adminPassword } = formData;

    // Validaciones
    if (password !== confirmPassword) {
      return setAlert({ message: "Las contraseñas no coinciden.", type: "error" });
    }
    if (password.length < 6) {
      return setAlert({ message: "La contraseña debe tener al menos 6 caracteres.", type: "error" });
    }
    if (role === "admin" && adminPassword.trim() === "") {
      return setAlert({ message: "Debes ingresar la contraseña de admin.", type: "error" });
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/signup", {
        email,
        password,
        name: email.split("@")[0],
        role,
        adminPassword: role === "admin" ? adminPassword : undefined,
      });

      setAlert({ message: response.data.message, type: "success" });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setAlert({ message: err.response?.data.message || "Error en el registro.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Contenedor principal (pantalla completa), sin scroll, centrado
    <div className="w-full h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-black to-red-600">
      {/* Tarjeta con escala al 80%, sombra brillante y hover suave */}
      <div
        className="bg-white w-full max-w-md mx-4 p-6 rounded-xl 
                   transform scale-[0.8] origin-center transition-all duration-500 
                   hover:scale-[0.83] 
                   shadow-[0_0_15px_5px_rgba(255,255,255,0.4)]"
      >
        <div className="text-center mb-6">
          <img src={logo} alt="Logo Tic America" className="w-24 h-24 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Crear Cuenta</h2>
        <p className="text-center text-gray-600 mb-6">Ingresa tus datos para registrarte.</p>

        {alert.message && (
          <div
            className={`text-center mb-4 px-4 py-2 rounded ${
              alert.type === "error"
                ? "bg-red-200 text-red-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {alert.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Correo */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition duration-300"
              placeholder="tucorreo@ejemplo.com"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition duration-300"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* Confirmar Contraseña */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition duration-300"
              placeholder="Repite tu contraseña"
              required
            />
          </div>

          {/* Selección de Rol */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full p-3 border rounded-md 
                         focus:ring-2 focus:ring-red-500 focus:border-red-500 
                         transition duration-300"
              required
            >
              <option value="">Selecciona un rol</option>
              <option value="usuario">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Contraseña de Admin */}
          {formData.role === "admin" && (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700">Contraseña de Admin</label>
              <input
                type="password"
                name="adminPassword"
                value={formData.adminPassword}
                onChange={handleChange}
                className="mt-1 w-full p-3 border rounded-md 
                           focus:ring-2 focus:ring-red-500 focus:border-red-500 
                           transition duration-300"
                placeholder="Ingresa la contraseña de admin"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-white font-semibold transition duration-300 ${
              isLoading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isLoading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-700">
            ¿Ya tienes cuenta?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-600 hover:underline cursor-pointer"
            >
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
