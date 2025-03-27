// perfil.js
import { useState } from "react";

export const useProfile = () => {
  const [editing, setEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    profilePhoto: "",
    companyInfo: {
      companyName: "",
      companyDescription: "",
      companyLocation: "",
      companyPhone: "",
    },
  });

  const handleEdit = () => setEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => {
      const keys = name.split(".");
      if (keys.length > 1) {
        return {
          ...prevInfo,
          [keys[0]]: { ...prevInfo[keys[0]], [keys[1]]: value },
        };
      }
      return { ...prevInfo, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setUserInfo((prevInfo) => ({
        ...prevInfo,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userInfo),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Cambios guardados exitosamente.");
        setEditing(false);
      } else {
        alert("Error al guardar los cambios: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al actualizar el perfil.");
    }
  };

  return {
    editing,
    userInfo,
    handleEdit,
    handleChange,
    handleFileChange,
    handleSave,
  };
};
