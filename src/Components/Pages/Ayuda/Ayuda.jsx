import { useState } from "react";

const sections = [
  {
    title: "📌 ¿Qué es TIC Americas?",
    content: `
      TIC Americas es un sistema de verificación de precios diseñado para supermercados y tiendas con puntos de venta (POS). 
      Su objetivo es facilitar la gestión de productos y publicidad, permitiendo a los administradores manejar el inventario de forma eficiente.
      
      🔹 **Usuarios del sistema**:
      - **Administradores**: Empresas que gestionan productos, publicidad y stock.
      - **Usuarios finales**: Solo pueden consultar información de productos, sin modificar datos.
      
      🔹 **Funciones clave de la plataforma**:
      - Administración de productos con precios fijos y categorías personalizables.
      - Gestión de publicidad dinámica a través de un slider.
      - Lector de códigos QR para obtener información detallada de cada producto.
      - Importación y exportación de productos desde archivos Excel.
      - Interfaz completamente responsiva y adaptable a cualquier dispositivo.
    `
  },
  {
    title: "🛠️ Inicio de Sesión y Registro",
    content: `
      El acceso a TIC Americas está protegido mediante autenticación JWT. 
      
      🔹 **Cómo iniciar sesión**:
      - Ingresa tu **correo electrónico** y **contraseña** en la pantalla de inicio de sesión.
      - Si los datos son correctos, accederás al panel de administración.
      - Si olvidaste tu contraseña, podrás restablecerla mediante un enlace de recuperación.

      🔹 **Cómo registrarse**:
      - Los **administradores** deben registrar una cuenta junto con la información de su empresa.
      - Los **usuarios normales** solo pueden registrarse con su información personal.
      - Al completar el registro, recibirás un acceso inmediato a la plataforma.

      ⚠️ **Solo los administradores pueden gestionar productos y publicidad. Los usuarios solo pueden ver información.**
    `
  },
  {
    title: "📦 Gestión de Productos",
    content: `
      Los administradores pueden agregar, editar y eliminar productos desde el panel de control. Cada producto tiene:
      
      - **SKU único**: Identificador exclusivo del producto.
      - **Nombre y descripción**: Información detallada del artículo.
      - **Imagen del producto**: Puede subirse directamente desde el sistema.
      - **Precio fijo**: No cambia automáticamente (los administradores deben actualizarlo manualmente).
      - **Categoría**: Agrupación de productos por tipo.
      
      🔹 **Acciones disponibles**:
      - **Agregar productos**: Rellena los campos necesarios y sube una imagen.
      - **Editar productos**: Modifica la información de productos existentes.
      - **Eliminar productos**: Remueve productos de la base de datos (acción irreversible).
      
      📌 **IMPORTANTE:** 
      - Solo los administradores pueden modificar productos.
      - Los usuarios solo pueden visualizar información de los productos.
    `
  },
  {
    title: "📢 Administración de Publicidad",
    content: `
      Los administradores pueden gestionar anuncios publicitarios que se mostrarán en un **slider dinámico** en la plataforma.
      
      🔹 **Cómo funciona la publicidad**:
      - Se agrupan en **categorías** (ejemplo: "Promociones", "Nuevos Productos", "Impresoras").
      - Las imágenes o videos subidos en una categoría aparecen en el slider en **el orden en que fueron agregadas**.
      - No hay opción de horarios programados; la publicidad se muestra de forma continua.

      🔹 **Acciones disponibles**:
      - **Crear nuevas categorías** de publicidad.
      - **Subir imágenes/videos** promocionales dentro de una categoría.
      - **Eliminar o modificar anuncios** si es necesario.
      
      ⚠️ **Solo los administradores pueden gestionar la publicidad.**
    `
  },
  {
    title: "📋 Importación y Exportación de Productos",
    content: `
      TIC Americas permite gestionar productos a gran escala mediante archivos **Excel**.
      
      🔹 **Opciones disponibles**:
      - **Importar productos** desde un archivo Excel con un formato predefinido.
      - **Exportar la lista de productos** actuales en un archivo Excel.

      🔹 **Cómo importar productos**:
      1. Descarga la plantilla de Excel desde la plataforma.
      2. Llena la información siguiendo las columnas establecidas.
      3. Carga el archivo en la sección de "Importación".
      4. El sistema validará los datos y agregará los productos automáticamente.

      🔹 **Cómo exportar productos**:
      - Simplemente haz clic en "Exportar" y el sistema generará un archivo Excel con la lista de productos.

      📌 **IMPORTANTE:** Si el archivo importado tiene errores de formato, el sistema lo notificará antes de procesarlo.
    `
  },
  {
    title: "📍 Lector de Códigos QR",
    content: `
      El sistema cuenta con un lector de códigos QR que permitirá a los usuarios y administradores obtener información rápida de los productos.

      🔹 **Cómo funciona**:
      - Se puede utilizar la **cámara del celular** o un **lector de códigos QR** externo.
      - Al escanear un producto, se mostrará **toda su información**:
        - Nombre
        - SKU
        - Foto del producto
        - Descripción
        - Precio

      🔹 **Acciones disponibles para administradores**:
      - **Consultar stock** en tiempo real.
      - **Ajustar existencias** directamente desde la interfaz.

      📌 **Actualmente en desarrollo.**
    `
  }
];

const Ayuda = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto mt-24 p-8 bg-gray-50 rounded-xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-10">
        📖 Manual de Usuario - TIC Americas
      </h1>
      <div className="max-w-4xl mx-auto">
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <button
              className="w-full text-left bg-blue-600 text-white px-6 py-3 text-xl font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 flex justify-between"
              onClick={() => toggleSection(index)}
            >
              {section.title}
              <span>{activeIndex === index ? "🔼" : "🔽"}</span>
            </button>
            {activeIndex === index && (
              <div className="bg-white p-4 mt-2 rounded-lg shadow-md text-gray-700">
                <p className="text-lg whitespace-pre-line">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ayuda;
