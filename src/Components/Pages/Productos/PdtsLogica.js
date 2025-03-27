// Frontend/src/Components/Pages/Productos/PdtsLogica.js

export function generarIdCorto() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export function agregarProducto(productos, nuevoProducto) {
  if (!nuevoProducto.id || !nuevoProducto.id.trim()) {
    nuevoProducto.id = generarIdCorto();
  }
  nuevoProducto.sku = (nuevoProducto.sku || "").substring(0, 5);
  if (!nuevoProducto.codigo_barras) {
    nuevoProducto.codigo_barras = "";
  }
  return [...productos, nuevoProducto];
}

export function editarProducto(productos, productoEditado) {
  return productos.map((p) => (p.id === productoEditado.id ? productoEditado : p));
}

export function eliminarProducto(productos, productoId) {
  return productos.filter((p) => p.id !== productoId);
}

export function toggleEstadoProducto(productos, productoId) {
  return productos.map((p) => (p.id === productoId ? { ...p, activo: !p.activo } : p));
}

export function filtrarProductosPorCategoria(productos, categoriaSeleccionada, categorias) {
  if (!categoriaSeleccionada || categoriaSeleccionada === "General") return productos;
  
  const catObj = categorias.find(cat => cat.name === categoriaSeleccionada);
  if (!catObj) return [];
  
  return productos.filter((p) => p.categoria_id === catObj.id);
}

export function filtrarProductosPorEstado(productos, estadoFiltro) {
  return estadoFiltro === "activos"
    ? productos.filter((p) => p.activo)
    : productos.filter((p) => !p.activo);
}

export function filtrarProductosPorNombre(productos, nombre) {
  if (!nombre.trim()) return productos;
  return productos.filter((p) =>
    p.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
}

export function agregarCategoria(categorias, nuevaCategoria) {
  const categoriaLimpia = nuevaCategoria.trim();
  if (categoriaLimpia && !categorias.some((c) => c.name === categoriaLimpia)) {
    return [...categorias, { id: generarIdCorto(), name: categoriaLimpia }];
  }
  return categorias;
}

export function editarCategoriaYActualizarProductos(productos, categorias, categoriaSeleccionada, nuevaCategoria) {
  const productosActualizados = productos.map((producto) =>
    producto.categoria === categoriaSeleccionada
      ? { ...producto, categoria: nuevaCategoria }
      : producto
  );
  const categoriasActualizadas = categorias.map((cat) =>
    cat.name === categoriaSeleccionada ? { ...cat, name: nuevaCategoria.trim() } : cat
  );
  return { productosActualizados, categoriasActualizadas };
}

export function eliminarCategoria(productos, categorias, categoriaId) {
  const catObj = categorias.find((c) => c.id === categoriaId);
  const productosActualizados = productos.map((producto) =>
    producto.categoria === (catObj ? catObj.name : "")
      ? { ...producto, categoria: "" }
      : producto
  );
  const categoriasActualizadas = categorias.filter((c) => c.id !== categoriaId);
  return { productosActualizados, categoriasActualizadas };
}

// ====================== NUEVA FUNCIÓN PARA FILTRAR GLOBALMENTE ======================
export function filtrarGlobal(productos, busqueda) {
  if (!busqueda.trim()) return productos;
  return productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
    (p.sku && p.sku.toLowerCase().includes(busqueda.toLowerCase()))
  );
}

// ====================== FUNCIONES PARA API (CRUD) ======================

export async function getAllProductos(token) {
  const res = await fetch("http://localhost:5000/api/productos", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

export async function createProductoInDB(nuevo, token) {
  const resp = await fetch("http://localhost:5000/api/productos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevo),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al crear producto");
  }
  return await resp.json();
}

export async function updateProductoInDB(producto, token) {
  const resp = await fetch(`http://localhost:5000/api/productos/${producto.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(producto),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al actualizar producto");
  }
  return await resp.json();
}

export async function deleteProductoInDB(productId, token) {
  const resp = await fetch(`http://localhost:5000/api/productos/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al eliminar producto");
  }
  return await resp.json();
}

export async function toggleProductoActivoInDB(productId, token) {
  const all = await getAllProductos(token);
  const prod = all.find((p) => p.id === productId);
  if (!prod) throw new Error("Producto no encontrado");
  const updated = { ...prod, activo: !prod.activo };
  const resp = await fetch(`http://localhost:5000/api/productos/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(updated),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al actualizar estado");
  }
  return await resp.json();
}

export async function getAllCategorias(token) {
  const res = await fetch("http://localhost:5000/api/productos/categorias", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener categorías");
  return await res.json();
}

export async function createCategoriaInDB(name, token) {
  const resp = await fetch("http://localhost:5000/api/productos/categorias", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name }),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al crear categoría");
  }
  return await resp.json();
}

export async function updateCategoriaInDB(id, newName, token) {
  const resp = await fetch(`http://localhost:5000/api/productos/categorias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name: newName }),
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al actualizar categoría");
  }
  return await resp.json();
}

export async function deleteCategoriaInDB(id, token) {
  const resp = await fetch(`http://localhost:5000/api/productos/categorias/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    const errData = await resp.json();
    throw new Error(errData.message || "Error al eliminar categoría");
  }
  return await resp.json();
}
