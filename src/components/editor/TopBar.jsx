import React, { useState } from "react";
import "./TopBar.css";
import { useLocation } from "react-router-dom";
import HomeToolbar from "./HomeToolbar";
import InsertToolbar from "./InsertToolbar";
import DrawToolbar from "./DrawToolbar";
import ViewToolbar from "./ViewToolbar";
import FileToolbar from "./FileToolbar";

const tabs = ["File", "Home", "Insert", "Draw", "View", "Help"];

const TopBar = ({ activeTab, setActiveTab, editor, notebookName }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "File":
        return <FileToolbar />;
      case "Home":
        return <HomeToolbar editor={editor} />;
      case "Insert":
        return <InsertToolbar editor={editor} />;
      case "Draw":
        return <DrawToolbar />;
      case "View":
        return <ViewToolbar />;
      case "Help":
        return (
          <div className="toolbar-section">🛟 Help section coming soon</div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="top-bar-wrapper">
      <div className="notebook-header-bar">
        <span className="notebook-title">{notebookName}</span>

        <span className="brand-logo">NoteLock</span>

        <button className="exit-btn" onClick={() => window.history.back()}>
          Exit
        </button>
      </div>

      <div className="topBar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="toolbar-section">{renderTabContent()}</div>
    </div>
  );
};

export default TopBar;
