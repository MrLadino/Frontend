import React, { useState, useEffect } from "react";
import logo from "../../assets/Logo.png";

const FancyLoader = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const duration = 3000; // Duración de 3 segundos
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPercentage(Math.floor(progress));
      if (elapsed < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-black to-red-600">
      <div className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl">
        <img src={logo} alt="Logo de TIC Americas" className="w-full h-full object-cover" />
        <div
          className="absolute bottom-0 left-0 w-full bg-white"
          style={{ height: `${100 - percentage}%` }}
        ></div>
      </div>
      <div className="mt-4 text-2xl font-bold text-white">{percentage}%</div>
    </div>
  );
};

export default FancyLoader;
