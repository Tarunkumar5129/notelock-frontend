import React, { useState } from "react";
import "../styles/EnterPinModal.css";

function EnterPinModal({ onClose, onSubmit }) {
  const [pin, setPin] = useState("");

  const handleSubmit = () => {
    if (pin.length === 4) {
      onSubmit(pin);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-containerEnter">
        <h2>Enter Pin to Select</h2>
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 4-digit PIN"
          maxLength={4}
        />
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleSubmit} className="create-btn">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnterPinModal;
