import React from "react";
import useHomeLogic from "./useHomeLogic";

const Home = () => {
  const { images, currentImage, handlePrev, handleNext } = useHomeLogic();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100 text-black">
      <main className="flex-grow">
        {/* ENCABEZADO PRINCIPAL */}
        <div className="pt-24 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-red-700 mb-4">
            TIC Americas
          </h1>
          <p className="text-gray-800 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto">
            La solución integral para <span className="font-bold">administrar</span> y{" "}
            <span className="font-bold">consultar</span> la información de tus productos de manera
            rápida y confiable.
          </p>
        </div>

        {/* SLIDER DE IMÁGENES/VÍDEOS (SIN BOTONES) */}
        <div className="relative w-full sm:w-3/4 lg:w-2/3 mx-auto mt-12 mb-16 shadow-2xl rounded-xl overflow-hidden transform hover:scale-105 transition duration-300">
          <img
            src={images[currentImage]}
            alt={`Slide ${currentImage + 1}`}
            className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-all duration-700 ease-in-out"
          />
        </div>

        {/* SECCIÓN DE VENTAJAS */}
        <div className="bg-white py-10 px-6 sm:px-12 lg:px-20 mx-auto max-w-screen-lg rounded-2xl shadow-2xl mb-16">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
            ¿Por qué elegir TIC Americas?
          </h2>
          <p className="text-center text-gray-700 text-lg mb-8">
            Optimiza la gestión y consulta de productos con herramientas diseñadas para facilitar
            tu día a día. Nuestra plataforma se adapta tanto a las necesidades de los administradores
            como a la experiencia de los usuarios.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Fácil de Usar</h4>
              <p className="text-gray-600 text-sm">
                Una interfaz intuitiva que simplifica la administración y la consulta de información.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Accesible</h4>
              <p className="text-gray-600 text-sm">
                Disponible en todos tus dispositivos, garantizando acceso en cualquier momento y lugar.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Soporte Continuo</h4>
              <p className="text-gray-600 text-sm">
                Asistencia y actualizaciones constantes para mantener tu negocio siempre en funcionamiento.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN PARA ADMINISTRADORES */}
        <div className="bg-red-600 py-10 px-6 sm:px-12 lg:px-20 mx-auto max-w-screen-lg rounded-2xl shadow-2xl mb-16 text-white">
          <h2 className="text-3xl font-bold text-center mb-6">
            Para Administradores
          </h2>
          <p className="text-center text-lg mb-8">
            Gestiona fácilmente tu inventario, personaliza la publicidad y actualiza la información
            de tu empresa. Con TIC Americas, mantén el control total de tu negocio con herramientas
            avanzadas y un diseño adaptable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white bg-opacity-10 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Administración Integral</h4>
              <p className="text-white text-sm">
                Actualiza productos, administra stock y controla la publicidad desde un solo lugar.
              </p>
            </div>
            <div className="p-6 bg-white bg-opacity-10 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Personalización Total</h4>
              <p className="text-white text-sm">
                Cambia colores, imágenes y categorías para reflejar la identidad única de tu empresa.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN PARA USUARIOS */}
        <div className="bg-gray-200 py-10 px-6 sm:px-12 lg:px-20 mx-auto max-w-screen-lg rounded-2xl shadow-2xl mb-16">
          <h2 className="text-3xl font-bold text-center text-red-700 mb-6">
            Para Usuarios Finales
          </h2>
          <p className="text-center text-gray-700 text-lg mb-8">
            Consulta información actualizada de tus productos en tiempo real. Nuestra interfaz
            intuitiva te brinda todos los detalles que necesitas de manera rápida y sencilla.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Consulta Rápida</h4>
              <p className="text-gray-600 text-sm">
                Accede a la información detallada de los productos, incluyendo precio, stock y más.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
              <h4 className="text-xl font-bold mb-3">Interfaz Intuitiva</h4>
              <p className="text-gray-600 text-sm">
                Encuentra lo que buscas en segundos gracias a un diseño optimizado y fácil de usar.
              </p>
            </div>
          </div>
        </div>

        {/* TESTIMONIOS */}
        <div className="py-16 mt-16 bg-black text-white">
          <h2 className="text-3xl font-extrabold text-center mb-6">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex flex-wrap justify-center gap-6 px-4 sm:px-6">
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <blockquote className="bg-red-600 p-6 sm:p-8 rounded-xl shadow-2xl">
                <p className="text-base sm:text-lg">
                  "TIC Americas ha revolucionado la forma en que gestionamos nuestros productos. La
                  interfaz es intuitiva y el soporte es excepcional."
                </p>
                <footer className="mt-4 text-sm">- Juan Pérez, Administrador</footer>
              </blockquote>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <blockquote className="bg-red-600 p-6 sm:p-8 rounded-xl shadow-2xl">
                <p className="text-base sm:text-lg">
                  "Como usuario, me encanta poder consultar toda la información de los productos de forma
                  rápida y sencilla. ¡Muy recomendable!"
                </p>
                <footer className="mt-4 text-sm">- María López, Usuario</footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="my-24" />
      </main>
    </div>
  );
};

export default Home;
