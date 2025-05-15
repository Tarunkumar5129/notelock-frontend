// src/components/editor/FileToolbar.jsx
import React from "react";
import "./FileToolbar.css";
import { FaEdit, FaLock, FaUnlock, FaShareAlt } from "react-icons/fa";

const FileToolbar = () => {
  const handleRename = () => {
    const newName = prompt("Enter new notebook name:");
    if (newName?.trim()) {
      console.log("Renaming notebook to:", newName);
    }
  };

  const handleSetPin = () => {
    const pin = prompt("Set 4-digit PIN:");
    if (pin && /^\d{4}$/.test(pin)) {
      console.log("Setting PIN:", pin);
    } else {
      alert("Invalid PIN. Must be 4 digits.");
    }
  };

  const handleChangePin = () => {
    const newPin = prompt("Enter new 4-digit PIN:");
    if (newPin && /^\d{4}$/.test(newPin)) {
      console.log("Changing PIN to:", newPin);
    } else {
      alert("Invalid new PIN.");
    }
  };

  const handleRemovePin = () => {
    if (window.confirm("Are you sure you want to remove the pin?")) {
      console.log("PIN removed");
    }
  };

  const handleShare = () => {
    const link = `${window.location.origin}/shared-link`;
    navigator.clipboard.writeText(link);
    alert("Notebook link copied to clipboard!");
  };

  return (
    <div className="file-toolbar">
      <button onClick={handleRename}>
        <FaEdit /> Rename
      </button>
      <button onClick={handleSetPin}>
        <FaLock /> SetPin
      </button>
      <button onClick={handleChangePin}>
        <FaUnlock /> Change
      </button>
      <button onClick={handleRemovePin}>❌Remove</button>
      <button onClick={handleShare}>
        <FaShareAlt /> Share
      </button>
    </div>
  );
};

export default FileToolbar;
