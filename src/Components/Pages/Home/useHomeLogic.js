import { useState, useEffect } from "react";
import slider1 from "../../../assets/Slider1.png";
import slider2 from "../../../assets/Slider2.png";

const useHomeLogic = () => {
  const images = [slider1, slider2];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  return { images, currentImage, handlePrev, handleNext };
};

export default useHomeLogic;
