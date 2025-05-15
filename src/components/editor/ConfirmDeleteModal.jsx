// src/components/editor/ConfirmDeleteModal.jsx
import React from "react";
import styles from "./ConfirmDeleteModal.module.css";

const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
  itemType = "item",
}) => {
  if (!visible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete this {itemType}?</p>
        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.btnConfirm} onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
