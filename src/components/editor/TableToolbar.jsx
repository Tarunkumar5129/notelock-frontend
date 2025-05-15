// src/components/editor/TableToolbar.jsx
import React from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";
import "./TableToolbar.css";

const TableToolbar = ({ editor }) => {
  if (!editor || !editor.isActive("table")) return null;

  return (
    <div className="table-toolbar">
      <button onClick={() => editor.chain().focus().addRowBefore().run()}>
        <AiOutlinePlus /> Row Above
      </button>
      <button onClick={() => editor.chain().focus().addRowAfter().run()}>
        <AiOutlinePlus /> Row Below
      </button>
      <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
        <AiOutlinePlus /> Column Before
      </button>
      <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
        <AiOutlinePlus /> Column After
      </button>
      <button onClick={() => editor.chain().focus().deleteRow().run()}>
        <AiOutlineMinus /> Delete Row
      </button>
      <button onClick={() => editor.chain().focus().deleteColumn().run()}>
        <AiOutlineMinus /> Delete Column
      </button>
      <button onClick={() => editor.chain().focus().deleteTable().run()}>
        <AiOutlineDelete /> Delete Table
      </button>
    </div>
  );
};

export default TableToolbar;
