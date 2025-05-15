// src/components/editor/AddPageModal.jsx
import React, { useState } from "react";
import "./AddPageModal.css";
const AddPageModal = ({ onClose, onAddPage }) => {
  const [pageNumber, setPageNumber] = useState("");

  const handleAdd = () => {
    const number = parseInt(pageNumber, 10);
    if (isNaN(number) || number <= 0) {
      alert("Please enter a valid page number.");
      return;
    }
    onAddPage(number);
    onClose();
  };

  return (
    <div className="modalOverlay">
      <div className="modalBox">
        <h3>Enter Page Number</h3>
        <input
          type="number"
          placeholder="Enter page number"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          min="1"
          style={{ marginTop: "10px", padding: "8px", width: "80%" }}
        />
        <div className="modalActions">
          <button className="btnCancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btnConfirm" onClick={handleAdd}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPageModal;
