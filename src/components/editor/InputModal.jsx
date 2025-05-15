import React, { useState } from "react";
import "./InputModal.css";

const InputModal = ({ title, placeholder, onSubmit, onClose }) => {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input.trim());
      onClose();
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputModal;
