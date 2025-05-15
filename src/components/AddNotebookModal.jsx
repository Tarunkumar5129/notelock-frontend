import React, { useState } from "react";
import "../styles/AddNotebookModal.css";

const iconOptions = ["📓", "📘", "📙", "📔", "📝", "📚", "🗂️", "💼", "📖"];
const colorOptions = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫"];

function AddNotebookModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [isSecured, setIsSecured] = useState(false);
  const [pin, setPin] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return alert("Please enter a notebook name.");
    if (isSecured && pin.length !== 4)
      return alert("Please enter a 4-digit pin.");
    onCreate({ name, isSecured, pin, selectedIcon, selectedColor });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Create New Notebook</h2>

        <input
          type="text"
          placeholder="Notebook name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="switch-label">
          <span>Lock this notebook?</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isSecured}
              onChange={() => setIsSecured(!isSecured)}
            />
            <span className="slider round"></span>
          </label>
        </label>

        {isSecured && (
          <input
            type="password"
            placeholder="Enter 4-digit PIN"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          />
        )}

        <div className="icon-selection">
          <span>Select icon:</span>
          <div className="icon-options">
            {iconOptions.map((icon) => (
              <span
                key={icon}
                className={`icon-option ${
                  selectedIcon === icon ? "selected" : ""
                }`}
                onClick={() => setSelectedIcon(icon)}
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div className="color-selection">
          <span>Select color:</span>
          <div className="color-options">
            {colorOptions.map((color) => (
              <span
                key={color}
                className={`color-option ${
                  selectedColor === color ? "selected" : ""
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNotebookModal;
