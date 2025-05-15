// src/components/editor/InsertToolbar.jsx
import React, { useState } from "react";
import { MdInsertPhoto, MdAudiotrack, MdVideoLibrary } from "react-icons/md";
import { AiOutlineTable } from "react-icons/ai";
import { PiMicrophoneStageFill } from "react-icons/pi";
import { FaShapes } from "react-icons/fa";
import "./InsertToolbar.css";

const InsertToolbar = ({ editor }) => {
  const insertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  return (
    <div className="insert-toolbar">
      <button title="Insert Table" onClick={insertTable}>
        <AiOutlineTable /> Table
      </button>
      <button title="Insert Picture">
        <MdInsertPhoto /> Picture
      </button>
      <button title="Insert Video">
        <MdVideoLibrary /> Video
      </button>
      <button title="Insert Audio">
        <MdAudiotrack /> Audio
      </button>
      <button title="Record Audio">
        <PiMicrophoneStageFill /> Record
      </button>
      <button title="Insert Shape">
        <FaShapes /> Shape
      </button>
    </div>
  );
};

export default InsertToolbar;
