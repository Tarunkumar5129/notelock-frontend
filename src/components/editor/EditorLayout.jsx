import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import TopBar from "./TopBar";
import "./EditorLayout.css";
import RichTextEditor from "./RichTextEditor";
import { toast } from "react-toastify";
import { RiFolderAddLine } from "react-icons/ri";
import { MdOutlineNoteAdd } from "react-icons/md";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import InputModal from "./InputModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import TableToolbar from "./TableToolbar";
import AddPageModal from "./AddPageModal";

const EditorLayout = ({ token }) => {
  const [activeTab, setActiveTab] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentKey, setContentKey] = useState(0);
  const [editor, setEditor] = useState(null);
  const [sections, setSections] = useState([
    { name: "Section 1", pages: [{ name: "Page 1", content: "" }] },
  ]);
  const location = useLocation();
  const { notebookId } = useParams();
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [loadingPageContent, setLoadingPageContent] = useState(false);
  const baseURL = "https://notelock-backend.onrender.com/api";
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [sectionToDeleteIndex, setSectionToDeleteIndex] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showTableToolbar, setShowTableToolbar] = useState(false);
  const notebookName = location.state?.notebookName || "Untitled Notebook";

  const handleAddSectionName = async (name) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        toast.error("You're not logged in.");
        return;
      }

      const res = await axios.post(
        `${baseURL}/sections`,
        { name, notebook: notebookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSection = {
        ...res.data,
        pages: [],
      };

      const pageRes = await axios.post(
        `${baseURL}/pages`,
        {
          name: "Page 1",
          content: "",
          section: res.data._id,
          notebook: notebookId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      newSection.pages.push(pageRes.data);

      setSections((prev) => [...prev, newSection]);
      setSelectedSectionIndex(sections.length);
      setSelectedPageIndex(0);
    } catch (err) {
      toast.error("Failed to create section or page");
      console.error(err);
    }
  };

  const handleAddSection = () => {
    setInputModalVisible(true);
  };

  const handleDeleteSection = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You're not logged in.");
      return;
    }

    const sectionId = sections[index]?._id;
    if (!sectionId) {
      toast.error("Section ID not found.");
      return;
    }

    try {
      await axios.delete(`${baseURL}/sections/${sectionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedSections = sections.filter((_, i) => i !== index);
      setSections(updatedSections);
      setSelectedSectionIndex(0);
      setSelectedPageIndex(0);
    } catch (err) {
      console.error("Delete section failed:", err);
      toast.error("Failed to delete section.");
    }
  };
  const confirmDeleteSection = () => {
    if (sectionToDeleteIndex !== null) {
      handleDeleteSection(sectionToDeleteIndex);
      setSectionToDeleteIndex(null);
      setShowDeleteConfirmModal(false);
    }
  };

  const handleAddPage = () => {
    if (sections.length === 0) {
      toast.error("Please create a section first to add pages.");
      return;
    }
    setShowAddPageModal(true);
  };

  const handleAddPageNumber = async (number) => {
    if (sections.length === 0) {
      toast.error("Please create a section first.");
      return;
    }

    const updatedSections = [...sections];
    const section = updatedSections[selectedSectionIndex];

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseURL}/pages`,
        {
          name: `Page ${number}`,
          content: "",
          section: section._id,
          notebook: notebookId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      section.pages.push(res.data);
      section.pages.sort((a, b) => a.name.localeCompare(b.name));
      setSections(updatedSections);
      setSelectedPageIndex(section.pages.length - 1);
    } catch (error) {
      console.error("Failed to create page:", error);
      toast.error("Failed to create page");
    }
  };

  const handleDeletePage = async (index) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You're not logged in.");
      return;
    }

    const pageId = sections[selectedSectionIndex]?.pages[index]?._id;
    if (!pageId) {
      toast.error("Page ID not found.");
      return;
    }

    try {
      await axios.delete(`${baseURL}/pages/${pageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedSections = [...sections];
      updatedSections[selectedSectionIndex].pages.splice(index, 1);
      setSections(updatedSections);
      setSelectedPageIndex(0);
    } catch (err) {
      console.error("Delete page failed:", err);
      toast.error("Failed to delete page.");
    }
  };

  const handleSelectSection = (index) => {
    setSelectedSectionIndex(index);
    setSelectedPageIndex(0);
  };

  const handleSelectPage = async (index) => {
    setSelectedPageIndex(index);

    const section = sections[selectedSectionIndex];
    const page = section?.pages?.[index];
    if (!page?._id) return;

    try {
      setLoadingPageContent(true);

      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/pages/${page._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pageContent = res.data.content || "";
      if (editor) {
        editor.commands.setContent(pageContent);
        editor.commands.focus();
      }

      setLoadingPageContent(false);
    } catch (err) {
      console.error("Failed to load page content:", err);
      toast.error("Failed to load page content");
      setLoadingPageContent(false);
    }
  };

  const selectedPageName =
    sections[selectedSectionIndex]?.pages[selectedPageIndex] || "";
  useEffect(() => {
    setContentKey((prev) => prev + 1);
  }, [selectedSectionIndex, selectedPageIndex]);

  const pageContent =
    sections[selectedSectionIndex]?.pages[selectedPageIndex]?.content || "";

  const handlePageContentChange = async (newContentJSON) => {
    const pageId =
      sections[selectedSectionIndex]?.pages[selectedPageIndex]?._id;
    if (!pageId) {
      console.warn("Invalid section or page ID");
      return;
    }

    const updatedSections = [...sections];
    updatedSections[selectedSectionIndex].pages[selectedPageIndex].content =
      newContentJSON;
    setSections(updatedSections);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/pages/${pageId}`,
        { content: newContentJSON },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to save content:", err);
      toast.error("Failed to save content");
    }
  };

  useEffect(() => {
    if (!notebookId) return;

    const fetchSectionsAndPages = async () => {
      try {
        const token = localStorage.getItem("token");

        const sectionRes = await axios.get(
          `${baseURL}/sections/${notebookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const sectionsWithPages = await Promise.all(
          sectionRes.data.map(async (section) => {
            const pageRes = await axios.get(`${baseURL}/pages/${section._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return { ...section, pages: pageRes.data };
          })
        );

        setSections(sectionsWithPages);
        setSelectedSectionIndex(0);
        setSelectedPageIndex(0);
      } catch (err) {
        toast.error("Failed to load notebook data");
        console.error(err);
      }
    };

    fetchSectionsAndPages();
  }, [notebookId]);

  return (
    <>
      <div className="editor-container">
        <TopBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          editor={editor}
          notebookName={notebookName}
        />

        <div className="editor-body">
          <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <button
              className="toggle-sidebar"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <AiOutlineMenuUnfold className="menu-icon" />
            </button>

            {sidebarOpen && (
              <div className="horizontal-split">
                <div className="sidebar-panel">
                  <div className="panel-header">
                    <h4>Sections</h4>
                    <RiFolderAddLine
                      className="icon-btn"
                      onClick={handleAddSection}
                      title="Add Section"
                    />
                  </div>
                  <ul>
                    {sections.map((section, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelectSection(index)}
                        className={
                          index === selectedSectionIndex ? "active" : ""
                        }
                      >
                        {section.name}
                        <IoMdRemoveCircleOutline
                          className="icon-btn-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSectionToDeleteIndex(index);
                            setShowDeleteConfirmModal(true);
                          }}
                          title="Remove Section"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-panel">
                  <div className="panel-header">
                    <h4>Pages</h4>
                    <MdOutlineNoteAdd
                      className="icon-btn"
                      onClick={handleAddPage}
                      title="Add Page"
                    />
                  </div>
                  <ul>
                    {sections[selectedSectionIndex]?.pages.map(
                      (page, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectPage(index)}
                          className={
                            index === selectedPageIndex ? "active" : ""
                          }
                        >
                          {page.name}
                          <IoMdRemoveCircleOutline
                            className="icon-btn-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePage(index);
                            }}
                            title="Remove Page"
                          />
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="editor-main">
            {showTableToolbar && editor && <TableToolbar editor={editor} />}
            <div key={contentKey} className="editor-content">
              {loadingPageContent ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <RichTextEditor
                  content={pageContent}
                  onChange={handlePageContentChange}
                  onEditorReady={setEditor}
                  onTableFocusChange={setShowTableToolbar}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {inputModalVisible && (
        <InputModal
          title="Enter Section Name"
          placeholder="e.g. Chapter 1"
          onSubmit={handleAddSectionName}
          onClose={() => setInputModalVisible(false)}
        />
      )}

      <ConfirmDeleteModal
        visible={showDeleteConfirmModal}
        onCancel={() => {
          setSectionToDeleteIndex(null);
          setShowDeleteConfirmModal(false);
        }}
        onConfirm={confirmDeleteSection}
        itemType="section"
      />

      {showAddPageModal && (
        <AddPageModal
          onClose={() => setShowAddPageModal(false)}
          onAddPage={handleAddPageNumber}
        />
      )}
    </>
  );
};

export default EditorLayout;
