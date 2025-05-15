// src/components/editor/ViewToolbar.jsx
import React, { useState } from "react";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaExpand,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./ViewToolbar.css";

const ViewToolbar = () => {
  const [zoom, setZoom] = useState(100);
  const [darkMode, setDarkMode] = useState(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  const handleFullPage = () => {
    document.documentElement.requestFullscreen?.();
  };

  return (
    <div className="view-toolbar">
      <button onClick={handleZoomOut} title="Zoom Out">
        <FaSearchMinus />
      </button>
      <span>{zoom}%</span>
      <button onClick={handleZoomIn} title="Zoom In">
        <FaSearchPlus />
      </button>

      <button onClick={handleFullPage} title="Full Page">
        <FaExpand />
      </button>

      <button onClick={handleThemeToggle} title="Toggle Theme">
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};

export default ViewToolbar;
