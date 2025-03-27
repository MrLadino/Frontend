import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useIniciarPrograma = () => {
  const navigate = useNavigate();

  // modo: "" (vista principal), "administrar" o "iniciar"
  const [modo, setModo] = useState("");
  // Categorías: [{ id, name }, ...]
  const [categorias, setCategorias] = useState([]);
  // Elementos: { "Categoria": [ { file_id, file_url, file_type, ... }, ... ], ... }
  const [elementos, setElementos] = useState({});
  // Categoría seleccionada: { id, name } o null
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [mostrarPanel, setMostrarPanel] = useState(false);

  // 1. Cargar categorías y archivos al montar
  useEffect(() => {
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
        // data: [{ category_id, name, files: [...] }, ...]
        const cats = data.map((cat) => ({
          id: cat.category_id,
          name: cat.name,
        }));
        setCategorias(cats);

        // Construir "elementos": { "Categoria": [...], ... }
        const tempElementos = {};
        data.forEach((cat) => {
          tempElementos[cat.name] = cat.files || [];
        });
        setElementos(tempElementos);

        // Seleccionar la primera categoría si no hay nada seleccionado
        if (cats.length > 0 && !categoriaSeleccionada) {
          setCategoriaSeleccionada(cats[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching advertising:", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Validar si al menos una categoría tiene archivos
  const validarPublicidad = () => {
    return Object.keys(elementos).some((catName) => {
      const arr = elementos[catName];
      return arr && arr.length > 0;
    });
  };

  // 3. Iniciar programa => almacenar categoría seleccionada y navegar a /programa
  const iniciarPrograma = () => {
    if (validarPublicidad()) {
      if (categoriaSeleccionada && categoriaSeleccionada.name) {
        localStorage.setItem("selectedCategory", categoriaSeleccionada.name);
      }
      setModo("iniciar");
      navigate("/programa");
    } else {
      alert("Debes configurar al menos una categoría con imágenes o videos antes de iniciar.");
    }
  };

  // 4. Abrir panel de administración
  const abrirAdministrarPublicidad = () => {
    setModo("administrar");
  };

  // 5. Crear nueva categoría (recibe el nombre en vez de usar prompt)
  const agregarCategoria = async (nuevaCategoria) => {
    if (!nuevaCategoria || !nuevaCategoria.trim()) return;

    // Verificar duplicado local
    if (categorias.some((c) => c.name.toLowerCase() === nuevaCategoria.toLowerCase())) {
      setError("El nombre de la categoría ya existe localmente.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://localhost:5000/api/advertising/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nuevaCategoria }),
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || "Error al crear categoría");
      }
      const data = await resp.json();
      setCategorias((prev) => [...prev, { id: data.category_id, name: data.name }]);
      setElementos((prev) => ({ ...prev, [data.name]: [] }));
      setCategoriaSeleccionada({ id: data.category_id, name: data.name });
      setError("");
    } catch (error) {
      console.error("Error al crear categoría:", error);
      setError(error.message);
    }
  };

  // 6. Editar categoría (recibe nuevoNombre en vez de usar prompt)
  const editarCategoria = async (catId, nuevoNombre) => {
    const catObj = categorias.find((c) => c.id === Number(catId));
    if (!catObj) return;
    if (!nuevoNombre || !nuevoNombre.trim()) return;

    // Verificar duplicado local
    if (categorias.some((c) => c.name.toLowerCase() === nuevoNombre.toLowerCase())) {
      setError("Ya existe otra categoría con ese nombre en tu estado local.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`http://localhost:5000/api/advertising/category/${catObj.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: nuevoNombre }),
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || "Error al editar categoría");
      }
      // Actualizar estado local
      const nuevas = categorias.map((c) =>
        c.id === catObj.id ? { ...c, name: nuevoNombre } : c
      );
      setCategorias(nuevas);

      // Actualizar las claves en "elementos"
      const copiaElementos = { ...elementos };
      copiaElementos[nuevoNombre] = copiaElementos[catObj.name];
      delete copiaElementos[catObj.name];
      setElementos(copiaElementos);

      // Si esta categoría estaba seleccionada, actualizamos su info
      setCategoriaSeleccionada({ id: catObj.id, name: nuevoNombre });
      setError("");
    } catch (error) {
      console.error("Error al editar categoría:", error);
      setError(error.message);
    }
  };

  // 7. Eliminar categoría (sin window.confirm)
  const eliminarCategoria = async (catId) => {
    const catObj = categorias.find((c) => c.id === Number(catId));
    if (!catObj) return;

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`http://localhost:5000/api/advertising/category/${catObj.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || "Error al eliminar categoría");
      }
      // Actualizar estado local
      const nuevas = categorias.filter((c) => c.id !== catObj.id);
      setCategorias(nuevas);
      const copiaElementos = { ...elementos };
      delete copiaElementos[catObj.name];
      setElementos(copiaElementos);
      if (nuevas.length > 0) {
        setCategoriaSeleccionada(nuevas[0]);
      } else {
        setCategoriaSeleccionada(null);
      }
      setError("");
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setError(error.message);
    }
  };

  // 8. Seleccionar categoría
  const seleccionarCategoria = (catId) => {
    const obj = categorias.find((c) => c.id === Number(catId));
    if (obj) {
      setCategoriaSeleccionada(obj);
      setError("");
    }
  };

  // 9. Subir archivos (imágenes/videos)
  const agregarElemento = async (catName, files) => {
    if (!files || files.length === 0) {
      setError("No se seleccionaron archivos válidos.");
      return;
    }
    const catObj = categorias.find((c) => c.name === catName);
    if (!catObj) {
      setError("Categoría no encontrada en el estado local.");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", catObj.id);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/webm"];
      if (!validTypes.includes(file.type)) {
        alert(`Archivo "${file.name}" no permitido. Solo imágenes o videos.`);
        continue;
      }
      formData.append("files", file);
    }

    try {
      const token = localStorage.getItem("token");
      const resp = await fetch("http://localhost:5000/api/advertising/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.message || "Error al subir archivos");
      }
      const data = await resp.json();
      console.log("Archivos subidos:", data);

      // Recargar la publicidad
      const resp2 = await fetch("http://localhost:5000/api/advertising", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newData = await resp2.json();
      const cats = newData.map((cat) => ({
        id: cat.category_id,
        name: cat.name,
      }));
      setCategorias(cats);
      const tempElementos = {};
      newData.forEach((cat) => {
        tempElementos[cat.name] = cat.files || [];
      });
      setElementos(tempElementos);

      const sameCat = cats.find((c) => c.id === catObj.id);
      if (sameCat) {
        setCategoriaSeleccionada(sameCat);
      }
      setError("");
    } catch (error) {
      console.error("Error al subir archivos:", error);
      setError(error.message);
    }
  };

  // 10. Eliminar un archivo (sin window.confirm)
  const eliminarElemento = async (catName, archivo) => {
    if (archivo.file_id) {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`http://localhost:5000/api/advertising/file/${archivo.file_id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resp.ok) {
          const errData = await resp.json();
          throw new Error(errData.message || "Error al eliminar archivo");
        }
        const copia = { ...elementos };
        copia[catName] = copia[catName].filter((item) => item.file_id !== archivo.file_id);
        setElementos(copia);
        cerrarPanel();
        setError("");
      } catch (error) {
        console.error("Error al eliminar archivo:", error);
        setError(error.message);
      }
    } else {
      // Si era un archivo local (File) sin file_id
      const copia = { ...elementos };
      copia[catName] = copia[catName].filter(
        (item) =>
          (item.file_name || item.name) !== (archivo.file_name || archivo.name)
      );
      setElementos(copia);
      cerrarPanel();
    }
  };

  // 11. Seleccionar archivo (para mostrar panel)
  const seleccionarArchivo = (archivo) => {
    setArchivoSeleccionado(archivo);
    setMostrarPanel(true);
  };

  const cerrarPanel = () => {
    setArchivoSeleccionado(null);
    setMostrarPanel(false);
  };

  // 12. "Hecho": volver a la vista inicial
  const volverAlEstadoBase = () => {
    setModo("");
    setError("");
  };

  return {
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
  };
};

export default useIniciarPrograma;
