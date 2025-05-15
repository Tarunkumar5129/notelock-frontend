// src/components/editor/DrawToolbar.jsx
import React, { useState } from "react";
import { FaPen, FaEraser, FaHighlighter } from "react-icons/fa";
import "./DrawToolbar.css";

const DrawToolbar = () => {
  const [selectedTool, setSelectedTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [stroke, setStroke] = useState(2);

  const tools = [
    { id: "pen", icon: <FaPen />, label: "Pen" },
    { id: "marker", icon: <FaHighlighter />, label: "Marker" },
    { id: "eraser", icon: <FaEraser />, label: "Eraser" },
  ];

  return (
    <div className="draw-toolbar">
      <div className="tool-buttons">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={selectedTool === tool.id ? "active" : ""}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <label>
        Stroke:
        <input
          type="range"
          min="1"
          max="10"
          value={stroke}
          onChange={(e) => setStroke(e.target.value)}
        />
        <span>{stroke}px</span>
      </label>
    </div>
  );
};

export default DrawToolbar;
