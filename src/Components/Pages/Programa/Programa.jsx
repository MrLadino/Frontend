import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";

const Programa = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [sliderItems, setSliderItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [timeForCurrent, setTimeForCurrent] = useState(0);
  const [showNoNovedades, setShowNoNovedades] = useState(false);
  const videoRef = useRef(null);

  // Estado para producto encontrado mediante escaneo
  const [producto, setProducto] = useState(null);
  // Estado para acumular los caracteres escaneados (sin campo de entrada visible)
  const [codigoEscaneado, setCodigoEscaneado] = useState("");

  // Cargar la publicidad desde la(s) categoría(s)
  useEffect(() => {
    const selectedCategory = localStorage.getItem("selectedCategory");
    // Para admin se usa la categoría almacenada; para usuario normal, se combinan todos los archivos
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:5000/api/advertising", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener publicidad");
        return res.json();
      })
      .then((data) => {
        if (isAdmin) {
          // Para admin se busca la categoría almacenada
          const categoryData = data.find((cat) => cat.name === selectedCategory);
          if (categoryData && categoryData.files && categoryData.files.length > 0) {
            setSliderItems(categoryData.files);
          } else {
            setSliderItems([]);
            setShowNoNovedades(true);
          }
        } else {
          // Para usuario normal se combinan los archivos de todas las categorías activas
          let allFiles = [];
          data.forEach((cat) => {
            allFiles = allFiles.concat(cat.files || []);
          });
          if (allFiles.length > 0) {
            setSliderItems(allFiles);
          } else {
            setSliderItems([]);
            setShowNoNovedades(true);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching advertising:", err);
      });
  }, [navigate, isAdmin]);

  // Escucha de eventos de teclado para capturar código de barras/QR
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Si se presiona Enter, se asume que el código completo fue escaneado
      if (event.key === "Enter") {
        buscarProducto(codigoEscaneado.trim());
        setCodigoEscaneado("");
      } else {
        // Acumula el carácter
        setCodigoEscaneado((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [codigoEscaneado]);

  // Función para buscar producto por código (sin campo visible)
  const buscarProducto = async (codigo) => {
    if (!codigo) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/productos/buscar/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Producto no encontrado");

      const data = await response.json();
      setProducto(data);
    } catch (error) {
      console.error("Error al buscar producto:", error);
      setProducto(null);
    }
  };

  // Función para cerrar la card del producto
  const cerrarProducto = () => setProducto(null);

  // Control de slider para publicidad
  useEffect(() => {
    setTimeForCurrent(0);
    if (sliderItems.length === 0) return;
    const currentItem = sliderItems[currentIndex];

    let intervalId;
    const removeVideoListener = () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("timeupdate", handleVideoTime);
      }
    };

    if (currentItem?.file_type === "image") {
      intervalId = setInterval(() => {
        setTimeForCurrent((prev) => {
          const newVal = prev + 1;
          if (newVal >= 5) {
            nextSlide();
          }
          return newVal;
        });
      }, 1000);
    } else {
      if (videoRef.current) {
        videoRef.current.addEventListener("timeupdate", handleVideoTime);
      }
    }

    return () => {
      clearInterval(intervalId);
      removeVideoListener();
    };
  }, [currentIndex, sliderItems]);

  const handleVideoTime = () => {
    if (!videoRef.current) return;
    setTimeForCurrent(videoRef.current.currentTime);
  };

  const handleVideoEnded = () => nextSlide();
  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex < sliderItems.length ? nextIndex : 0;
    });
  };

  // Modal de "Cerrar": se abre para solicitar contraseña y volver al inicio
  const handleCerrarClick = () => {
    setShowModal(true);
    setPassword("");
    setErrorMsg("");
  };

  useEffect(() => {
    let timeout;
    if (showModal) {
      timeout = setTimeout(() => {
        setShowModal(false);
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [showModal]);

  const handleConfirm = () => {
    fetch("http://localhost:5000/api/auth/validate-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Contraseña incorrecta");
        return res.json();
      })
      .then((data) => {
        if (data.valid) {
          navigate("/home");
        } else {
          throw new Error("Contraseña incorrecta");
        }
      })
      .catch((err) => {
        setErrorMsg("Contraseña incorrecta");
        setTimeout(() => {
          setShowModal(false);
          setErrorMsg("");
        }, 2000);
      });
  };

  const currentItem = sliderItems[currentIndex];

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black pt-24 pb-10 px-4">
      {/* Botón "Cerrar" para abrir el modal */}
      <button
        onClick={handleCerrarClick}
        className="absolute top-8 right-8 bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        Cerrar
      </button>

      {/* Si se ha escaneado un producto, mostrar la card */}
      {producto ? (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-80">
            <h2 className="text-xl font-bold text-center mb-4">{producto.nombre}</h2>
            {producto.imagen ? (
              <img src={producto.imagen} alt={producto.nombre} className="w-40 h-40 mx-auto rounded-lg" />
            ) : (
              <div className="w-40 h-40 bg-gray-200 mx-auto rounded-lg flex items-center justify-center">
                Sin imagen
              </div>
            )}
            <p className="text-gray-700 mt-2"><strong>Descripción:</strong> {producto.descripcion}</p>
            <p className="text-gray-700"><strong>Precio:</strong> ${producto.precio}</p>
            <p className={`mt-2 ${producto.stock <= 5 ? "text-red-600 font-bold" : "text-gray-700"}`}>
              <strong>Stock:</strong> {producto.stock}
            </p>
            <div className="flex justify-end mt-4">
              <button onClick={cerrarProducto} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Volver
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {sliderItems.length === 0 && showNoNovedades ? (
            <div className="flex flex-col items-center justify-center h-full text-white">
              <h1 className="text-3xl font-bold mb-4">Publicidad - TIC Americas</h1>
              <p className="mb-8 text-lg">No hay novedades por ahora.</p>
            </div>
          ) : (
            <div className="mx-auto max-w-5xl h-[75vh] rounded-2xl shadow-2xl border-4 border-indigo-500 bg-white overflow-hidden relative">
              <div className="w-full h-full bg-black flex items-center justify-center">
                {currentItem?.file_type === "image" ? (
                  <img src={currentItem.file_url} alt={`Slide ${currentIndex + 1}`} className="w-full h-full object-contain" />
                ) : (
                  <video ref={videoRef} src={currentItem?.file_url} className="w-full h-full object-contain" autoPlay muted onEnded={handleVideoEnded} />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal de confirmación para cerrar el apartado */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[999999]">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-80 transform transition duration-300 hover:scale-105">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Ingrese su contraseña para cerrar el apartado
            </h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="Contraseña"
            />
            {errorMsg && <p className="text-red-500 text-center mb-2">{errorMsg}</p>}
            <div className="flex justify-around">
              <button onClick={handleConfirm} className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
                Confirmar
              </button>
              <button onClick={() => setShowModal(false)} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programa;
