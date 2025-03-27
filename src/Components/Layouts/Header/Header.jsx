import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import logo from "../../../assets/Logo.png";
import exitImg from "../../../assets/Exit.png";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { logout, authenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determina si es admin
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    if (authenticated) {
      logout();
      navigate("/login");
    } else {
      console.error("El usuario no está autenticado.");
    }
  };

  // Ocultar el header si estamos en /programa
  if (location.pathname === "/programa") return null;

  return (
    <header className="bg-gradient-to-r from-red-700 to-blue-900 text-white py-4 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 flex items-center justify-between md:flex-row">
        {/* Logo y título */}
        <div className="flex items-center space-x-4 text-center">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
          <h1 className="text-2xl font-bold">TIC Americas</h1>
        </div>

        {/* Botón de menú hamburguesa (pantallas pequeñas) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* Menú de navegación */}
        <nav
          className={`absolute lg:relative top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent text-black lg:text-white p-4 lg:p-0 shadow-md lg:shadow-none transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-6 text-center`}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-6 text-lg font-semibold">
            <li>
              <Link
                to="/"
                className="hover:text-red-500 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
            </li>

            {/* Link “Publicidad” según rol */}
            <li>
              {isAdmin ? (
                <Link
                  to="/lector-estatico"
                  className="hover:text-red-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Publicidad
                </Link>
              ) : (
                <Link
                  to="/programa"
                  className="hover:text-red-500 transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Publicidad
                </Link>
              )}
            </li>

            {/* Rutas visibles solo si está autenticado */}
            {authenticated && (
              <>
                <li>
                  <Link
                    to="/lector-dinamico"
                    className="hover:text-red-500 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Lector QR
                  </Link>
                </li>
                <li>
                  <Link
                    to="/productos"
                    className="hover:text-red-500 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Productos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="hover:text-red-500 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ayuda"
                    className="hover:text-red-500 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ayuda
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Botón de logout (solo si autenticado) */}
          {authenticated && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center bg-red-700 p-3 rounded-full hover:bg-red-600 transition-all mt-4 lg:mt-0 ml-0 lg:ml-4"
            >
              <img src={exitImg} alt="Salir" className="h-6 w-6" />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
