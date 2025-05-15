import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notebooks.css";
import AddNotebookModal from "./AddNotebookModal";
import { toast } from "react-toastify";
import EnterPinModal from "./EnterPinModal";

function Notebooks({ token, onAddClick }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [notebooks, setNotebooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedNotebooks, setSelectedNotebooks] = useState([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pendingNotebook, setPendingNotebook] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetchNotebooks();
  }, [token]);

  const fetchNotebooks = () => {
    axios
      .get("https://notelock-backend.onrender.com/api/notebooks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setNotebooks(res.data))
      .catch((err) => {
        console.error("Failed to fetch notebooks:", err);
        toast.error("Unable to load notebooks");
      });
  };
  const handleConfirmDelete = async () => {
    if (selectedNotebooks.length === 0) {
      setIsDeleteMode(false);
      toast.info("No notebooks selected.");
      return;
    }
    try {
      for (let id of selectedNotebooks) {
        await axios.delete(
          "https://notelock-backend.onrender.com/api/notebooks/${id}",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      toast.success("Deleted selected notebooks.");
      fetchNotebooks();
      setSelectedNotebooks([]);
      setIsDeleteMode(false);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete notebooks.");
    }
  };

  const handleNotebookClick = (nb) => {
    if (!isDeleteMode) {
      if (nb.isSecured) {
        setPendingNotebook(nb);
        setPinModalVisible(true);
        return;
      }
      navigate(`/editor/${nb._id}`, {
        state: {
          notebookName: nb.name,
          notebookId: nb._id,
        },
      });
      return;
    }

    const isAlreadySelected = selectedNotebooks.includes(nb._id);

    if (isAlreadySelected) {
      toggleNotebookSelection(nb._id);
    } else if (nb.isSecured) {
      setPendingNotebook(nb);
      setPinModalVisible(true);
    } else {
      toggleNotebookSelection(nb._id);
    }
  };

  const toggleNotebookSelection = (id) => {
    if (selectedNotebooks.includes(id)) {
      setSelectedNotebooks(selectedNotebooks.filter((nid) => nid !== id));
    } else {
      setSelectedNotebooks([...selectedNotebooks, id]);
    }
  };
  const verifyPin = (enteredPin) => {
    if (pendingNotebook && pendingNotebook.pin === enteredPin) {
      if (isDeleteMode) {
        toggleNotebookSelection(pendingNotebook._id);
      } else {
        navigate(`/editor/${pendingNotebook._id}`, {
          state: {
            notebookName: pendingNotebook.name,
          },
        });
      }
      setPendingNotebook(null);
      setPinModalVisible(false);
    } else {
      toast.error("Incorrect PIN!");
    }
  };

  const handleCreateNotebook = async ({
    name,
    isSecured,
    pin,
    selectedIcon,
    selectedColor,
  }) => {
    try {
      const res = await axios.post(
        "https://notelock-backend.onrender.com/api/notebooks",
        { name, isSecured, pin, icon: selectedIcon, color: selectedColor },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Notebook created!");
      setNotebooks((prev) => [res.data, ...prev]);
    } catch (err) {
      if (
        err.response &&
        err.response.data.message?.includes("already exists")
      ) {
        toast.error(`Notebook with name "${name}" already exists`);
      } else {
        console.error("Create error:", err);
        toast.error("Error creating notebook");
      }
    }
  };

  const filtered = notebooks.filter((nb) =>
    nb.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <section className="notebooks-section">
        <div className="top-bar">
          <h2>Notebooks</h2>
          <input
            type="text"
            placeholder="🔍 Search notebook..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="subheader">
          <h3>My Notebooks</h3>
          <div className="addDeleteBtn">
            <button className="btn" onClick={() => setShowModal(true)}>
              Add
            </button>
            <button
              className={`btn ${isDeleteMode ? "confirm" : "delete"}`}
              onClick={() => {
                if (isDeleteMode) {
                  handleConfirmDelete();
                } else {
                  setIsDeleteMode(true);
                }
              }}
            >
              {isDeleteMode ? "Confirm" : "Delete"}
            </button>
          </div>
        </div>

        <div className="notebook-grid">
          {filtered.map((nb) => (
            <div
              key={nb._id}
              className={`notebook-card ${
                selectedNotebooks.includes(nb._id) ? "selected" : ""
              }`}
              onClick={() => handleNotebookClick(nb)}
            >
              {isDeleteMode && !selectedNotebooks.includes(nb._id) && (
                <span className="checkbox-placeholder">⬜</span>
              )}

              {selectedNotebooks.includes(nb._id) && (
                <span className="checkmark">✔</span>
              )}

              {nb.color && !nb.icon && (
                <span className="notebook-color-dot right-dot">{nb.color}</span>
              )}

              <span className="notebook-title">{nb.name}</span>
              {nb.isSecured && <span className="lock-badge">🔒</span>}

              {nb.icon && (
                <span className="notebook-icon">
                  {nb.color && (
                    <span className="notebook-color-dot">{nb.color}</span>
                  )}
                  {nb.icon}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <AddNotebookModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateNotebook}
        />
      )}
      {pinModalVisible && (
        <EnterPinModal
          onSubmit={verifyPin}
          onClose={() => {
            setPendingNotebook(null);
            setPinModalVisible(false);
          }}
        />
      )}
    </>
  );
}

export default Notebooks;
