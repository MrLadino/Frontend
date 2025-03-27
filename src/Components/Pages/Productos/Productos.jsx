import React, { useState, useEffect } from "react";
import {
  filtrarProductosPorCategoria,
  filtrarProductosPorEstado,
  getAllProductos,
  createProductoInDB,
  updateProductoInDB,
  deleteProductoInDB,
  toggleProductoActivoInDB,
  getAllCategorias,
  createCategoriaInDB,
  updateCategoriaInDB,
  deleteCategoriaInDB,
  editarCategoriaYActualizarProductos,
  filtrarGlobal
} from "./PdtsLogica";
import { useAuth } from "../../../Context/AuthContext";

const inputShakeStyle = `
  focus:animate-[shake_0.3s_ease-in-out_1]
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
`;

const Productos = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("activos");

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState("");
  const [productoEnEdicion, setProductoEnEdicion] = useState(null);

  const [editandoCategoria, setEditandoCategoria] = useState(false);
  const [categoriaEnEdicion, setCategoriaEnEdicion] = useState(null);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState("");

  const [notificacion, setNotificacion] = useState(null);
  const mostrarNotificacion = (mensaje, tipo = "info") => {
    setNotificacion({ mensaje, tipo });
    setTimeout(() => setNotificacion(null), 3000);
  };

  const [mostrarModalArchivo, setMostrarModalArchivo] = useState(false);
  const [archivoExcel, setArchivoExcel] = useState(null);

  // Estado para confirmación (producto o categoría)
  const [confirmacion, setConfirmacion] = useState(null);
  const mostrarConfirmacion = (mensaje, onConfirm) => {
    setConfirmacion({ mensaje, onConfirm });
  };
  const cerrarConfirmacion = () => {
    setConfirmacion(null);
  };
  const aceptarConfirmacion = () => {
    if (confirmacion && confirmacion.onConfirm) {
      confirmacion.onConfirm();
    }
    setConfirmacion(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getAllProductos(token)
      .then((data) => setProductos(data))
      .catch(() => setProductos([]));

    getAllCategorias(token)
      .then((data) => {
        const cats = data.map((cat) => ({
          id: cat.category_id,
          name: cat.name || "",
        }));
        setCategorias(cats);
        // Se deja la categoría en vacío para que el usuario la seleccione
        setCategoriaSeleccionada("");
      })
      .catch(() => {
        setCategorias([]);
        setCategoriaSeleccionada("");
      });
  }, [isAdmin]);

  const manejarBusqueda = (e) => setBusqueda(e.target.value);

  // =========================================================
  // CONTROL DE FILTRADO SEGÚN SI ES ADMIN O USUARIO NORMAL
  // =========================================================
  let productosCoincidentes = [];

  if (isAdmin) {
    // =========== Lógica para Admin ===========
    // Muestra productos aunque no haya categoría seleccionada
    if (busqueda.trim()) {
      // Si hay texto en el input de búsqueda
      productosCoincidentes = filtrarGlobal(productos, busqueda);
    } else {
      // Si no hay texto de búsqueda, filtra por categoría (puede ser "")
      productosCoincidentes = filtrarProductosPorCategoria(
        productos,
        categoriaSeleccionada,
        categorias
      );
    }
    // Luego filtra por estado (activos/inactivos) solo para admin
    productosCoincidentes = filtrarProductosPorEstado(
      productosCoincidentes,
      estadoFiltro
    );
  } else {
    // =========== Lógica para Usuario Normal ===========
    // Si no ha seleccionado categoría, no se muestra ningún producto
    if (!categoriaSeleccionada) {
      productosCoincidentes = [];
    } else {
      // Si seleccionó categoría
      if (busqueda.trim()) {
        productosCoincidentes = filtrarGlobal(productos, busqueda);
      } else {
        productosCoincidentes = filtrarProductosPorCategoria(
          productos,
          categoriaSeleccionada,
          categorias
        );
      }
      // El usuario normal solo ve productos activos
      productosCoincidentes = productosCoincidentes.filter((p) => p.activo);
    }
  }

  // =========================================================
  // CRUD de productos
  // =========================================================
  const handleAgregarProducto = async (nuevo) => {
    if (
      !nuevo.sku?.trim() ||
      !nuevo.nombre?.trim() ||
      !nuevo.descripcion?.trim() ||
      isNaN(nuevo.precio) ||
      nuevo.precio <= 0 ||
      isNaN(nuevo.stock) ||
      nuevo.stock < 0 ||
      !nuevo.categoria?.trim()
    ) {
      mostrarNotificacion("Completa los campos obligatorios y selecciona una categoría.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await createProductoInDB(nuevo, token);
      const data = await getAllProductos(token);
      setProductos(data);
      setMostrarModal(false);
      mostrarNotificacion("Producto agregado correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const handleEditarProducto = async (prodEdit) => {
    if (
      !prodEdit.nombre?.trim() ||
      isNaN(prodEdit.precio) ||
      prodEdit.precio <= 0 ||
      !prodEdit.categoria
    ) {
      mostrarNotificacion("Completa todos los campos correctamente.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await updateProductoInDB(prodEdit, token);
      const data = await getAllProductos(token);
      setProductos(data);
      setMostrarModal(false);
      mostrarNotificacion("Producto actualizado correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const handleEliminarProductoEnModal = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await deleteProductoInDB(id, token);
      const data = await getAllProductos(token);
      setProductos(data);
      setMostrarModal(false);
      mostrarNotificacion("Producto eliminado correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const confirmarEliminarProducto = (id) => {
    mostrarConfirmacion("¿Estás seguro de eliminar este producto?", () =>
      handleEliminarProductoEnModal(id)
    );
  };

  const handleToggleEstadoEnModal = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await toggleProductoActivoInDB(id, token);
      const data = await getAllProductos(token);
      setProductos(data);
      setProductoEnEdicion(data.find((p) => p.id === id) || null);
      mostrarNotificacion("Estado del producto actualizado.", "info");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  // =========================================================
  // CRUD de categorías
  // =========================================================
  const handleAgregarCategoria = async (nombre) => {
    const categoriaLimpia = nombre.trim();
    if (!categoriaLimpia) {
      mostrarNotificacion("La categoría no puede estar vacía.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const catData = await createCategoriaInDB(categoriaLimpia, token);
      const data = await getAllCategorias(token);
      const cats = data.map((cat) => ({
        id: cat.category_id,
        name: cat.name || "",
      }));
      setCategorias(cats);
      if (!categoriaSeleccionada) setCategoriaSeleccionada(catData.name);
      setMostrarModal(false);
      mostrarNotificacion("Categoría agregada correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const handleEditarCategoria = async () => {
    if (!nuevoNombreCategoria.trim()) {
      mostrarNotificacion("El nombre de la categoría no puede estar vacío.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await updateCategoriaInDB(categoriaEnEdicion.id, nuevoNombreCategoria.trim(), token);
      const { productosActualizados, categoriasActualizadas } = editarCategoriaYActualizarProductos(
        productos,
        categorias,
        categoriaEnEdicion.name,
        nuevoNombreCategoria.trim()
      );
      setProductos(productosActualizados);
      setCategorias(categoriasActualizadas);
      if (categoriaSeleccionada.toLowerCase() === categoriaEnEdicion.name.toLowerCase()) {
        setCategoriaSeleccionada(nuevoNombreCategoria.trim());
      }
      setMostrarModal(false);
      mostrarNotificacion("Categoría editada correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const handleEliminarCategoriaEnModal = async () => {
    if (!categoriaEnEdicion) return;
    const token = localStorage.getItem("token");
    try {
      await deleteCategoriaInDB(categoriaEnEdicion.id, token);
      const data = await getAllCategorias(token);
      const cats = data.map((c) => ({
        id: c.category_id,
        name: c.name || "",
      }));
      setCategorias(cats);
      setCategoriaSeleccionada("");
      setMostrarModal(false);
      mostrarNotificacion("Categoría eliminada correctamente.", "success");
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const confirmarEliminarCategoria = () => {
    mostrarConfirmacion("¿Estás seguro de eliminar esta categoría?", () =>
      handleEliminarCategoriaEnModal()
    );
  };

  // =========================================================
  // Abrir/Cerrar modales
  // =========================================================
  const abrirModalProducto = (modo, producto = null) => {
    setEditandoCategoria(false);
    setModoEdicion(modo);
    setProductoEnEdicion(
      producto || {
        id: "",
        sku: "",
        nombre: "",
        descripcion: "",
        imagen: "",
        precio: 0,
        stock: 0,
        categoria: categoriaSeleccionada || "",
        activo: true,
        codigo_barras: ""
      }
    );
    setMostrarModal(true);
  };

  const abrirModalCategoria = (modo, cat = null) => {
    setEditandoCategoria(true);
    setModoEdicion(modo);
    if (modo === "agregar") {
      setCategoriaEnEdicion(null);
      setNuevoNombreCategoria("");
    } else {
      setCategoriaEnEdicion(cat);
      setNuevoNombreCategoria(cat?.name || "");
    }
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoEnEdicion(null);
    setCategoriaEnEdicion(null);
    setNuevoNombreCategoria("");
  };

  // =========================================================
  // Funciones para Excel
  // =========================================================
  const descargarExcel = () => {
    const token = localStorage.getItem("token");
    window.open(`http://localhost:5000/api/productos/export-excel?token=${token}`, "_blank");
  };

  const handleArchivoExcel = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoExcel(e.target.files[0]);
    }
  };

  const subirExcel = async () => {
    if (!archivoExcel) {
      mostrarNotificacion("Selecciona un archivo Excel primero.", "error");
      return;
    }
    if (!categoriaSeleccionada) {
      mostrarNotificacion("Debes seleccionar una categoría antes de importar.", "error");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("excel", archivoExcel);
    formData.append("categoryName", categoriaSeleccionada);

    try {
      const response = await fetch(`http://localhost:5000/api/productos/import-excel?token=${token}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message);
      }
      await response.json();
      const data = await getAllProductos(token);
      setProductos(data);
      mostrarNotificacion("Productos importados correctamente.", "success");
      setMostrarModalArchivo(false);
      setArchivoExcel(null);
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  };

  const abrirModalArchivo = () => {
    setMostrarModalArchivo(true);
    setArchivoExcel(null);
  };

  const cerrarModalArchivo = () => {
    setMostrarModalArchivo(false);
    setArchivoExcel(null);
  };

  // =========================================================
  // Render
  // =========================================================
  return (
    <div className="max-w-7xl mx-auto mt-20 p-8">
      {/* ALERTA */}
      {notificacion && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl border z-[999999] transition-all duration-300 transform ${
            notificacion.tipo === "success"
              ? "bg-green-100 border-green-400 text-green-800"
              : notificacion.tipo === "error"
              ? "bg-red-100 border-red-400 text-red-800"
              : "bg-gray-100 border-gray-300 text-gray-800"
          }`}
        >
          {notificacion.mensaje}
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN */}
      {confirmacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] transition-all duration-300">
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-xl w-96 shadow-2xl transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-700">TIC Americas</h3>
            <p className="text-gray-700 mb-6">{confirmacion.mensaje}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cerrarConfirmacion}
                className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={aceptarConfirmacion}
                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Encabezado */}
      {isAdmin ? (
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <h1 className="text-4xl font-extrabold text-red-700 text-center">
            Gestión de Productos
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Administra tus productos, categorías y archivos Excel de manera sencilla.
          </p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-2xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <h1 className="text-4xl font-extrabold text-red-700 text-center">
            Catálogo de Productos
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Descubre nuestra selección y explora todo lo que tenemos para ti.
          </p>
        </div>
      )}

      {/* Panel de controles */}
      {isAdmin ? (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-700 mb-8 transform hover:scale-105 transition duration-300">
          <div className="flex flex-col lg:flex-row items-center justify-around space-y-4 lg:space-y-0 lg:space-x-6">
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="p-3 border rounded bg-gray-100 text-red-800 w-52 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">-- Selecciona categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoriaSeleccionada && (
              <select
                value={estadoFiltro}
                onChange={(e) => setEstadoFiltro(e.target.value)}
                className="p-3 border rounded bg-gray-100 text-red-800 w-52 focus:ring-2 focus:ring-red-500 transition"
              >
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => abrirModalCategoria("agregar")}
                className="bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 text-sm transition"
              >
                Agregar categoría
              </button>
              {categoriaSeleccionada && (
                <button
                  onClick={() => {
                    const catObj = categorias.find((c) => c.name === categoriaSeleccionada);
                    if (catObj) abrirModalCategoria("editar", catObj);
                  }}
                  className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-900 text-sm transition"
                >
                  Editar categoría
                </button>
              )}
            </div>
          </div>

          {/* 
            El admin puede ver productos incluso sin seleccionar categoría.
            Por eso mostramos los siguientes controles sin condicionar.
          */}
          <div className="mt-6 flex flex-col items-center space-y-4">
            <div className="relative w-full md:w-3/4 lg:w-1/2">
              <input
                type="text"
                value={busqueda}
                onChange={manejarBusqueda}
                placeholder="Buscar producto..."
                className={`p-3 border rounded w-full text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${inputShakeStyle}`}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => abrirModalProducto("agregar")}
                className="bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 text-sm transition"
              >
                Agregar producto
              </button>
              <button
                onClick={abrirModalArchivo}
                className="bg-blue-700 text-white py-2 px-6 rounded-lg hover:bg-blue-800 text-sm transition"
              >
                Agregar por archivo
              </button>
            </div>
            <p className="text-red-800 font-semibold">
              Mostrando productos {estadoFiltro.toUpperCase()}
            </p>
          </div>
        </div>
      ) : (
        // Panel para usuario normal
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-700 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-around">
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="p-3 border rounded bg-gray-100 text-red-800 w-full sm:w-52 focus:ring-2 focus:ring-red-500 transition"
            >
              <option value="">-- Seleccione categoría --</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={busqueda}
              onChange={manejarBusqueda}
              placeholder="Buscar producto..."
              className={`p-3 border rounded w-full sm:w-72 text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition ${inputShakeStyle}`}
            />
          </div>
        </div>
      )}

      {/* 
        Muestra la tabla de productos solo si:
        - Eres admin (puedes ver siempre).
        - O bien eres usuario normal y ya seleccionaste una categoría.
      */}
      {(isAdmin || (!isAdmin && categoriaSeleccionada)) && (
        /* 
           Se cambia overflow-x-hidden a overflow-x-auto 
           para permitir scroll horizontal en pantallas pequeñas 
        */
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto shadow-2xl rounded-2xl">
          <table className="w-full table-fixed border-collapse bg-white rounded-2xl">
            <thead className="bg-red-800 text-white sticky top-0">
              <tr>
                {isAdmin && <th className="px-4 py-3 text-left w-16">ID</th>}
                <th className="px-4 py-3 text-left w-24">SKU</th>
                <th className="px-4 py-3 text-left w-28">Imagen</th>
                <th className="px-4 py-3 text-left w-40">Nombre</th>
                <th className="px-4 py-3 text-left w-72">Descripción</th>
                {isAdmin && <th className="px-4 py-3 text-left w-20">Stock</th>}
                <th className="px-4 py-3 text-left w-32">Precio</th>
                {isAdmin && <th className="px-4 py-3 text-left w-28">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {productosCoincidentes.map((prod, idx) => (
                <tr
                  key={prod.id}
                  className={`transition-colors ${
                    prod.activo
                      ? idx % 2 === 0
                        ? "bg-gray-50 hover:bg-gray-100"
                        : "bg-white hover:bg-gray-100"
                      : "bg-gray-300 opacity-70"
                  }`}
                >
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">{prod.id}</td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">{prod.sku}</td>
                  <td className="px-4 py-3">
                    {prod.imagen ? (
                      <img
                        src={prod.imagen}
                        alt={prod.nombre}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                        Sin img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-normal break-words">
                    {prod.nombre}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="max-h-20 overflow-y-auto whitespace-normal break-words p-2">
                      {prod.descripcion}
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">{prod.stock}</td>
                  )}
                  <td className="px-4 py-3 whitespace-nowrap">
                    ${Number(prod.precio).toFixed(2)}
                  </td>
                  {isAdmin && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setModoEdicion("editar");
                          setProductoEnEdicion(prod);
                          setEditandoCategoria(false);
                          setMostrarModal(true);
                        }}
                        className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-900 text-sm transition"
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl max-h-[90vh] overflow-y-auto transform hover:scale-105 transition duration-300">
            {editandoCategoria ? (
              <>
                {modoEdicion === "agregar" ? (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Agregar Categoría
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Editar Categoría
                  </h3>
                )}
                <label className="block mb-2 text-sm font-semibold text-black">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={nuevoNombreCategoria}
                  onChange={(e) => setNuevoNombreCategoria(e.target.value)}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />
                <div className="flex justify-end space-x-4">
                  {modoEdicion === "editar" && (
                    <button
                      onClick={confirmarEliminarCategoria}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  )}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  {modoEdicion === "agregar" ? (
                    <button
                      onClick={() => handleAgregarCategoria(nuevoNombreCategoria)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={handleEditarCategoria}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {modoEdicion === "agregar" ? (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Agregar Producto
                  </h3>
                ) : (
                  <h3 className="text-2xl font-semibold mb-4 text-red-700">
                    Editar Producto
                  </h3>
                )}
                <label className="block mb-2 text-sm font-semibold text-black">
                  Nombre del producto
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.nombre || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      nombre: e.target.value
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Descripción
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.descripcion || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      descripcion: e.target.value
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Stock
                </label>
                <input
                  type="number"
                  value={productoEnEdicion?.stock || 0}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      stock: parseInt(e.target.value) || 0
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Precio
                </label>
                <input
                  type="number"
                  value={productoEnEdicion?.precio || 0}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      precio: parseFloat(e.target.value) || 0
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  SKU (máx. 5 caracteres)
                </label>
                <input
                  type="text"
                  value={productoEnEdicion?.sku || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      sku: e.target.value.substring(0, 5)
                    })
                  }
                  maxLength={5}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                <label className="block mb-2 text-sm font-semibold text-black">
                  Código de Barras
                </label>
                <input
                  type="text"
                  onFocus={(e) => e.target.select()}
                  value={productoEnEdicion?.codigo_barras || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      codigo_barras: e.target.value
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />

                {/* Select para cambiar la categoría */}
                <label className="block mb-2 text-sm font-semibold text-black">
                  Categoría
                </label>
                <select
                  value={productoEnEdicion?.categoria || ""}
                  onChange={(e) =>
                    setProductoEnEdicion({
                      ...productoEnEdicion,
                      categoria: e.target.value
                    })
                  }
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                >
                  <option value="">-- Seleccione categoría --</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <label className="block mb-2 text-sm font-semibold text-black">
                  Imagen (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setProductoEnEdicion({
                          ...productoEnEdicion,
                          imagen: reader.result
                        });
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
                />
                {productoEnEdicion?.imagen && (
                  <img
                    src={productoEnEdicion.imagen}
                    alt="Vista previa"
                    className="w-32 h-32 object-cover mt-2 mx-auto rounded"
                  />
                )}

                <div className="flex flex-wrap justify-end gap-2 mt-4">
                  {modoEdicion === "editar" && (
                    <>
                      <button
                        onClick={() => handleToggleEstadoEnModal(productoEnEdicion.id)}
                        className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
                      >
                        {productoEnEdicion?.activo ? "Inactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => confirmarEliminarProducto(productoEnEdicion.id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setMostrarModal(false)}
                    className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  {modoEdicion === "agregar" ? (
                    <button
                      onClick={() => handleAgregarProducto(productoEnEdicion)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditarProducto(productoEnEdicion)}
                      className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {mostrarModalArchivo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-700">
              Agregar por archivo
            </h3>
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-2">
                Descarga un Excel con la lista de productos o sube un archivo Excel para importarlos.
              </p>
              <button
                onClick={descargarExcel}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 mr-2 text-sm transition"
              >
                Descargar Excel
              </button>
            </div>
            <hr className="my-4" />
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-black">
                Subir archivo Excel
              </label>
              <input
                type="file"
                accept=".xls,.xlsx"
                onChange={handleArchivoExcel}
                className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
              />
              <button
                onClick={subirExcel}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm transition"
              >
                Importar
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={cerrarModalArchivo}
                className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 text-sm transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
