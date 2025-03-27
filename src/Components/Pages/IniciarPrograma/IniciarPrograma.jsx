import { useState } from "react";
import useIniciarPrograma from "./IPLogica";
import iniciarImg from "../../../assets/Iniciar.png";
import administrarImg from "../../../assets/Logo.png";
// Ícono/imagen para "Categorías Activas" (cámbialo si tienes otro):
import categoriasImg from "../../../assets/Logo.png"; // Reemplaza con tu imagen real

const IniciarPrograma = () => {
  const {
    modo,
    categorias,
    elementos,
    categoriaSeleccionada,
    error,
    archivoSeleccionado,
    mostrarPanel,
    iniciarPrograma,
    abrirAdministrarPublicidad,
    agregarCategoria,
    editarCategoria,
    eliminarCategoria,
    seleccionarCategoria,
    agregarElemento,
    eliminarElemento,
    seleccionarArchivo,
    cerrarPanel,
    volverAlEstadoBase,
    validarPublicidad,
  } = useIniciarPrograma();

  // Nombre de la categoría seleccionada
  const selectedCategoryName = categoriaSeleccionada ? categoriaSeleccionada.name : "";

  // ====== MODAL DE CONFIRMACIÓN PARA ELIMINAR ARCHIVO ======
  const [showConfirmDeleteFile, setShowConfirmDeleteFile] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const openConfirmDeleteFile = (file) => {
    setFileToDelete(file);
    setShowConfirmDeleteFile(true);
  };

  const closeConfirmDeleteFile = () => {
    setFileToDelete(null);
    setShowConfirmDeleteFile(false);
  };

  const confirmDeleteFile = () => {
    if (fileToDelete) {
      eliminarElemento(selectedCategoryName, fileToDelete);
    }
    setFileToDelete(null);
    setShowConfirmDeleteFile(false);
  };

  // ====== MODAL DE CONFIRMACIÓN PARA ELIMINAR CATEGORÍA ======
  const [showConfirmDeleteCategory, setShowConfirmDeleteCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const openConfirmDeleteCategory = (catId) => {
    const catObj = categorias.find((c) => c.id === Number(catId));
    if (catObj) {
      setCategoryToDelete(catObj);
      setShowConfirmDeleteCategory(true);
    }
  };

  const closeConfirmDeleteCategory = () => {
    setCategoryToDelete(null);
    setShowConfirmDeleteCategory(false);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      eliminarCategoria(categoryToDelete.id);
    }
    setCategoryToDelete(null);
    setShowConfirmDeleteCategory(false);
  };

  // ====== MODAL PARA EDITAR EL NOMBRE DE LA CATEGORÍA ======
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [tempCategoryName, setTempCategoryName] = useState("");
  const [categoryIdToEdit, setCategoryIdToEdit] = useState(null);

  const openEditCategoryModal = (catId) => {
    const catObj = categorias.find((c) => c.id === Number(catId));
    if (catObj) {
      setCategoryIdToEdit(catObj.id);
      setTempCategoryName(catObj.name);
      setShowEditCategoryModal(true);
    }
  };

  const closeEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setTempCategoryName("");
    setCategoryIdToEdit(null);
  };

  const handleSaveCategoryName = () => {
    if (categoryIdToEdit) {
      editarCategoria(categoryIdToEdit, tempCategoryName);
    }
    closeEditCategoryModal();
  };

  // ====== MODAL PARA AGREGAR NUEVA CATEGORÍA ======
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const openAddCategoryModal = () => {
    setNewCategoryName("");
    setShowAddCategoryModal(true);
  };

  const closeAddCategoryModal = () => {
    setNewCategoryName("");
    setShowAddCategoryModal(false);
  };

  const handleAddCategory = () => {
    agregarCategoria(newCategoryName);
    closeAddCategoryModal();
  };

  // ====== NUEVO PANEL PARA "CATEGORÍAS ACTIVAS" ======
  const [showActiveCategoriesPanel, setShowActiveCategoriesPanel] = useState(false);

  const openActiveCategoriesPanel = () => {
    setShowActiveCategoriesPanel(true);
  };

  const closeActiveCategoriesPanel = () => {
    setShowActiveCategoriesPanel(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 transition-all duration-500">
      <div className="mt-40 mb-16 max-w-2xl w-full bg-white p-8 sm:p-10 rounded-2xl shadow-2xl text-center transform hover:scale-105 transition duration-500">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Iniciar Programa</h2>
        <p className="text-gray-700 mb-6 text-base">
          Este apartado te permite iniciar el programa o administrar la publicidad asociada.
        </p>

        {/* ====== BOTONES PRINCIPALES ====== */}
        <div className="flex flex-col sm:flex-row justify-around items-center sm:space-x-6 mb-8">
          {/* Botón Iniciar (Izquierda) */}
          <div className="flex flex-col items-center mb-4 sm:mb-0">
            <img
              src={iniciarImg}
              alt="Iniciar"
              className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full cursor-pointer shadow-lg transition-transform duration-300 ${
                validarPublicidad() ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={validarPublicidad() ? iniciarPrograma : undefined}
            />
            <p className="mt-2 text-gray-700 font-semibold text-sm sm:text-base">Iniciar</p>
            {!validarPublicidad() && (
              <p className="text-red-500 text-xs mt-1">
                Configura publicidad antes de iniciar
              </p>
            )}
          </div>

          {/* Botón Administrar Publicidad (Centro) */}
          <div className="flex flex-col items-center mb-4 sm:mb-0">
            <img
              src={administrarImg}
              alt="Administrar"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full cursor-pointer hover:scale-105 shadow-lg transition-transform duration-300"
              onClick={abrirAdministrarPublicidad}
            />
            <p className="mt-2 text-gray-700 font-semibold text-sm sm:text-base">
              Administrar Publicidad
            </p>
          </div>

          {/* NUEVO: Botón Categorías Activas (Derecha) */}
          <div className="flex flex-col items-center">
            <img
              src={categoriasImg}
              alt="Categorías Activas"
              className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full cursor-pointer hover:scale-105 shadow-lg transition-transform duration-300"
              onClick={openActiveCategoriesPanel}
            />
            <p className="mt-2 text-gray-700 font-semibold text-sm sm:text-base">
              Categorías Activas
            </p>
          </div>
        </div>

        {/* ====== CATEGORÍA SELECCIONADA O MENSAJE DE "NO HAY NOVEDADES" ====== */}
        {categorias.length === 0 ? (
          <p className="text-gray-700 font-semibold mb-4">No hay novedades por ahora</p>
        ) : selectedCategoryName ? (
          <p className="text-gray-700 font-semibold mb-4">
            Categoría seleccionada: {selectedCategoryName}
          </p>
        ) : (
          <p className="text-gray-700 font-semibold mb-4">No hay categoría seleccionada</p>
        )}

        {/* ====== PANEL DE ADMINISTRACIÓN (si modo === "administrar") ====== */}
        {modo === "administrar" && (
          <div className="text-left mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Administrar Publicidad
            </h3>

            {/* Gestión de Categorías */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categorías
              </label>
              <select
                className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                onChange={(e) => seleccionarCategoria(e.target.value)}
                value={categoriaSeleccionada ? categoriaSeleccionada.id : ""}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={openAddCategoryModal}
                  className="bg-green-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-green-700 transition-colors"
                >
                  Agregar categoría
                </button>
                {categoriaSeleccionada && (
                  <>
                    <button
                      onClick={() => openEditCategoryModal(categoriaSeleccionada.id)}
                      className="bg-blue-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                      Editar nombre
                    </button>
                    <button
                      onClick={() => openConfirmDeleteCategory(categoriaSeleccionada.id)}
                      className="bg-red-600 text-white py-2 px-5 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                    >
                      Eliminar categoría
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Gestión de Elementos (Imágenes/Videos) */}
            {categoriaSeleccionada && (
              <div className="text-center mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                  Elementos en {selectedCategoryName}
                </h4>
                {elementos[selectedCategoryName] &&
                  elementos[selectedCategoryName].length > 0 && (
                    <p className="text-sm text-gray-500 mb-2">
                      Vista previa de los archivos
                    </p>
                  )}
                <div className="overflow-y-auto max-h-96">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {elementos[selectedCategoryName] &&
                      elementos[selectedCategoryName].map((elemento, index) => (
                        <div
                          key={index}
                          className="w-full h-48 rounded-lg shadow-lg bg-gray-200 flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          onClick={() => seleccionarArchivo(elemento)}
                        >
                          {elemento.file_url ? (
                            elemento.file_type === "image" ? (
                              <img
                                src={elemento.file_url}
                                alt=""
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <video
                                src={elemento.file_url}
                                className="w-full h-full object-contain rounded-lg"
                              />
                            )
                          ) : (
                            elemento instanceof File && (
                              elemento.type.startsWith("image") ? (
                                <img
                                  src={URL.createObjectURL(elemento)}
                                  alt=""
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              ) : (
                                <video
                                  src={URL.createObjectURL(elemento)}
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              )
                            )
                          )}
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => agregarElemento(selectedCategoryName, e.target.files)}
                    className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-red-600 font-medium mt-4">{error}</p>}

            {/* Botón "Hecho" */}
            <div className="text-center mt-8">
              <button
                onClick={volverAlEstadoBase}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Hecho
              </button>
            </div>
          </div>
        )}

        {/* ====== PANEL DE ARCHIVO SELECCIONADO ====== */}
        {mostrarPanel && archivoSeleccionado && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[999999] transition-all duration-300">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-96 transform hover:scale-105 transition duration-300">
              <h4 className="text-lg font-bold text-gray-800 mb-4">Información del archivo</h4>
              <p className="text-sm text-gray-600 mb-2">
                Tipo: {archivoSeleccionado.file_type || archivoSeleccionado.type}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Tamaño:{" "}
                {archivoSeleccionado.size
                  ? (archivoSeleccionado.size / 1024).toFixed(2)
                  : "N/A"}{" "}
                KB
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => openConfirmDeleteFile(archivoSeleccionado)}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-700 transition-colors"
                >
                  Eliminar
                </button>
                <button
                  onClick={cerrarPanel}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-md hover:bg-gray-400 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ====== MODAL DE CONFIRMACIÓN PARA ELIMINAR ARCHIVO ====== */}
      {showConfirmDeleteFile && fileToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[999999] transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-80 sm:w-96 shadow-2xl transform hover:scale-105 transition duration-300">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirmar eliminación
            </h2>
            <p className="mb-4 text-center text-gray-700">¿Eliminar este archivo?</p>
            <div
              className="mb-4 mx-auto text-center text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-[280px] sm:max-w-[320px]"
              title={fileToDelete.file_url || fileToDelete.name}
            >
              {fileToDelete.file_url || fileToDelete.name}
            </div>
            <div className="flex justify-around">
              <button
                onClick={confirmDeleteFile}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
              <button
                onClick={closeConfirmDeleteFile}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL DE CONFIRMACIÓN PARA ELIMINAR CATEGORÍA ====== */}
      {showConfirmDeleteCategory && categoryToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-[999999] transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-80 sm:w-96 shadow-2xl transform hover:scale-105 transition duration-300">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
              Confirmar eliminación
            </h2>
            <p className="mb-4 text-center text-gray-700">
              ¿Eliminar la categoría?
            </p>
            <div
              className="mb-4 mx-auto text-center text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap w-full max-w-[280px] sm:max-w-[320px]"
              title={categoryToDelete.name}
            >
              {categoryToDelete.name}
            </div>
            <div className="flex justify-around">
              <button
                onClick={confirmDeleteCategory}
                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Eliminar
              </button>
              <button
                onClick={closeConfirmDeleteCategory}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL PARA EDITAR EL NOMBRE DE LA CATEGORÍA ====== */}
      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl max-h-[90vh] overflow-y-auto transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-700">Editar nombre de la categoría</h3>
            <label className="block mb-2 text-sm font-semibold text-black">
              Introduce el nuevo nombre para la categoría:
            </label>
            <input
              type="text"
              value={tempCategoryName}
              onChange={(e) => setTempCategoryName(e.target.value)}
              className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeEditCategoryModal}
                className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategoryName}
                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== MODAL PARA AGREGAR NUEVA CATEGORÍA ====== */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl max-h-[90vh] overflow-y-auto transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-700">Agregar categoría</h3>
            <label className="block mb-2 text-sm font-semibold text-black">
              Introduce el nombre de la nueva categoría:
            </label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="p-3 border mb-4 w-full rounded focus:ring-2 focus:ring-red-500 transition"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeAddCategoryModal}
                className="bg-gray-500 text-black py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== NUEVO MODAL: PANEL DE "CATEGORÍAS ACTIVAS" ====== */}
      {showActiveCategoriesPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] transition-all duration-300">
          <div className="bg-white p-6 rounded-xl w-96 shadow-2xl max-h-[90vh] overflow-y-auto transform hover:scale-105 transition duration-300">
            <h3 className="text-2xl font-semibold mb-4 text-red-700">Categorías Activas</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left">Categoría</th>
                    <th className="py-2 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => (
                    <tr key={cat.id} className="border-b">
                      <td className="py-2 px-4">{cat.name}</td>
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => openConfirmDeleteCategory(cat.id)}
                          className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeActiveCategoriesPanel}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition text-sm"
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

export default IniciarPrograma;
