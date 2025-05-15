// src/components/editor/HomeToolbar.jsx
import React from "react";
import { FaBold, FaItalic, FaUnderline, FaUndo, FaRedo } from "react-icons/fa";
import {
  MdFormatColorText,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify,
} from "react-icons/md";
import { BiHighlight } from "react-icons/bi";
import { LuSubscript, LuSuperscript } from "react-icons/lu";
import "./HomeToolbar.css";
import { useState } from "react";

const HomeToolbar = ({ editor }) => {
  const [showAlignOptions, setShowAlignOptions] = useState(false);

  const handleAlignment = (type) => {
    editor.chain().focus().setTextAlign(type).run();
    setShowAlignOptions(false);
  };
  return (
    <div className="home-toolbar">
      <button
        title="Bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <FaBold />
      </button>
      <button
        title="Italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <FaItalic />
      </button>
      <button
        title="Underline"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <FaUnderline />
      </button>

      <select
        className="font-select"
        onChange={(e) => {
          const selectedFont = e.target.value;
          editor.chain().focus().setFontFamily(selectedFont).run();
        }}
      >
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
        <option value="Roboto">Roboto</option>
        <option value="Georgia">Georgia</option>
        <option value="'Lobster', cursive">Lobster</option>
        <option value="'Space Mono', monospace">Space Mono</option>

        <option value="Courier New">Courier New</option>
        <option value="Trebuchet MS">Trebuchet MS</option>
        <option value="Lucida Console">Lucida Console</option>
        <option value="Palatino Linotype">Palatino Linotype</option>
        <option value="Tahoma">Tahoma</option>
        <option value="Comic Sans MS">Comic Sans MS</option>
        <option value="Impact">Impact</option>
        <option value="Segoe UI">Segoe UI</option>
        <option value="Garamond">Garamond</option>
      </select>

      <select
        className="font-size-select"
        onChange={(e) => {
          const fontSize = e.target.value;
          editor.chain().focus().setMark("textStyle", { fontSize }).run();
        }}
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="24px">24px</option>
        <option value="30px">30px</option>
      </select>

      <button
        title="Subscript"
        onClick={() => editor.chain().focus().toggleSubscript().run()}
      >
        <LuSubscript />
      </button>

      <button
        title="Superscript"
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
      >
        <LuSuperscript />
      </button>

      <button
        title="Highlight"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <BiHighlight />
      </button>

      <button
        title="Bullet Points"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <MdFormatListBulleted />
      </button>

      <button title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo />
      </button>
      <button title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo />
      </button>
      <label className="color-picker" title="Font Color">
        <MdFormatColorText />
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
      </label>
      <div className="align-dropdown">
        <button
          className="align-btn"
          title="Text Alignment"
          onClick={() => setShowAlignOptions(!showAlignOptions)}
        >
          <MdFormatAlignLeft />
        </button>
        {showAlignOptions && (
          <div className="align-options">
            <button onClick={() => handleAlignment("left")}>
              <MdFormatAlignLeft />
            </button>
            <button onClick={() => handleAlignment("center")}>
              <MdFormatAlignCenter />
            </button>
            <button onClick={() => handleAlignment("right")}>
              <MdFormatAlignRight />
            </button>
            <button onClick={() => handleAlignment("justify")}>
              <MdFormatAlignJustify />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeToolbar;
