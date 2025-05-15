import React, { useState } from "react";
import Header from "./Header";
import Notebooks from "./Notebooks";
import AddNotebookModal from "./AddNotebookModal";
import "../styles/DashboardPage.css";

function DashboardPage() {
  const token = localStorage.getItem("token");
  const [showModal, setShowModal] = useState(false);
  if (!token) {
    window.location.href = "/";
    return null;
  }
  return (
    <div className="app-container">
      <Header />
      <main className="main-section">
        <Notebooks token={token} onAddClick={() => setShowModal(true)} />
      </main>
      {showModal && (
        <AddNotebookModal
          onClose={() => setShowModal(false)}
          onCreate={(data) => {
            console.log("New notebook data:", data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
export default DashboardPage;
