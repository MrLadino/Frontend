// Frontend/src/Components/Pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../Context/AuthContext";
import axios from "axios";

const Profile = () => {
  const { authenticated, user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    description: "",
    phone: "",
    profile_photo: "",
    companyName: "",
    companyDescription: "",
    companyLocation: "",
    companyPhone: "",
    companyPhoto: "",
    companyContact: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (authenticated) {
      axios
        .get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((response) => {
          const data = response.data;
          setProfileData({
            name: data?.name || "",
            email: data?.email || "",
            description: data?.description || "",
            phone: data?.phone || "",
            profile_photo: data?.profile_photo || "",
            companyName: data?.companyName || "",
            companyDescription: data?.companyDescription || "",
            companyLocation: data?.companyLocation || "",
            companyPhone: data?.companyPhone || "",
            companyPhoto: data?.companyPhoto || "",
            companyContact: data?.companyContact || "",
          });
          setLoading(false);
        })
        .catch(() => {
          setError("Error al cargar los datos del perfil");
          setLoading(false);
        });
    }
  }, [authenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const formData = new FormData();
      formData.append("file", files[0]);
      const token = localStorage.getItem("token");
      axios
        .post("http://localhost:5000/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.fileUrl) {
            setProfileData((prev) => ({
              ...prev,
              [name]: res.data.fileUrl,
            }));
          }
        })
        .catch(() => {
          setError("Error al subir la imagen");
        });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.put("http://localhost:5000/api/profile", profileData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowSuccess(true);
      setEditing(false);
    } catch {
      setError("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing((prev) => !prev);
  };

  if (loading) {
    return <p className="text-center text-xl">Cargando perfil...</p>;
  }
  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="mt-20 min-h-screen bg-gray-50">
      {/* Modal de éxito */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">TIC Americas</h2>
            <p className="text-gray-800">¡Perfil actualizado con éxito!</p>
            <button
              className="bg-red-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-red-700 transition"
              onClick={() => setShowSuccess(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-8">
        {/* Título principal */}
        <h2 className="text-5xl font-extrabold text-center text-red-600 mb-10">
          Mi Perfil
        </h2>

        <div className={`grid gap-10 ${isAdmin ? "md:grid-cols-2" : "md:grid-cols-1"}`}>
          {/* Tarjeta de Perfil de Usuario */}
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto transform transition hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden shadow-2xl">
                <img
                  src={
                    profileData.profile_photo
                      ? profileData.profile_photo.startsWith("http")
                        ? profileData.profile_photo
                        : `http://localhost:5000${profileData.profile_photo}`
                      : "/default-user.png"
                  }
                  alt="Foto de perfil"
                  className="w-full h-full object-cover"
                />
              </div>
              {editing && (
                <div className="mt-4">
                  <label className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
                    Cambiar Imagen
                    <input
                      type="file"
                      name="profile_photo"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-lg font-semibold text-gray-800">
                Nombre:
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.name}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Email:
              </label>
              <p className="text-gray-700 mt-2">{profileData.email}</p>
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Descripción:
              </label>
              {editing ? (
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.description}</p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-lg font-semibold text-gray-800">
                Teléfono:
              </label>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition"
                />
              ) : (
                <p className="text-gray-700 mt-2">{profileData.phone}</p>
              )}
            </div>
          </div>

          {/* Tarjeta de Información de la Empresa (solo si es admin) */}
          {isAdmin && (
            <div className="bg-gray-900 text-white p-6 rounded-xl shadow-xl w-full max-w-md mx-auto transform transition hover:scale-105 duration-300">
              <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
                Empresa
              </h2>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-md overflow-hidden shadow-2xl">
                  <img
                    src={
                      profileData.companyPhoto
                        ? profileData.companyPhoto.startsWith("http")
                          ? profileData.companyPhoto
                          : `http://localhost:5000${profileData.companyPhoto}`
                        : "/default-company.png"
                    }
                    alt="Foto de la empresa"
                    className="w-full h-full object-cover"
                  />
                </div>
                {editing && (
                  <div className="mt-4">
                    <label className="cursor-pointer bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition">
                      Cambiar Imagen
                      <input
                        type="file"
                        name="companyPhoto"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-lg font-semibold">Nombre:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={profileData.companyName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyName}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Descripción:</label>
                {editing ? (
                  <textarea
                    name="companyDescription"
                    value={profileData.companyDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyDescription}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Ubicación:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyLocation"
                    value={profileData.companyLocation}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyLocation}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Teléfono:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyPhone"
                    value={profileData.companyPhone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyPhone}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-lg font-semibold">Contacto:</label>
                {editing ? (
                  <input
                    type="text"
                    name="companyContact"
                    value={profileData.companyContact}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:ring-2 focus:ring-red-500 transition text-black"
                  />
                ) : (
                  <p className="mt-2">{profileData.companyContact}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Botón Editar / Guardar (centrado) */}
        <div className="mt-8 flex justify-center">
          {editing ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition duration-300 text-xl font-semibold"
            >
              Guardar
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition duration-300 text-xl font-semibold"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
