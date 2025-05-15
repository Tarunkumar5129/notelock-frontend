// src/components/editor/RichTextEditor.jsx
import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontSize from "./extensions/FontSize";
import FontFamily from "./extensions/FontFamily";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "./extensions/Subscript";
import Superscript from "./extensions/Superscript";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";

import "./RichTextEditor.css";

const RichTextEditor = ({
  content,
  onChange,
  onEditorReady,
  onTableFocusChange,
}) => {
  const editor = useEditor({
    extensions: [
      TextStyle,
      Color,
      FontSize,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Underline,
      Highlight,
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      StarterKit.configure({
        textStyle: true,
        paragraph: {
          keepMarks: true,
          keepAttributes: true,
        },
        table: false,
      }),

      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "my-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "editor-content",
      },
      preserveMarks: true,
      preserveAttributes: true,
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(json);
    },
  });

  useEffect(() => {
    if (editor && content) {
      const current = editor.getJSON();
      const incoming =
        typeof content === "object" ? content : { type: "doc", content: [] };

      if (JSON.stringify(current) !== JSON.stringify(incoming)) {
        editor.commands.setContent(incoming);
      }
    }
  }, [content]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const inTable = editor.isActive("table");
      if (typeof onTableFocusChange === "function") {
        onTableFocusChange(inTable);
      }
    };

    editor.on("selectionUpdate", handleSelectionUpdate);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
    };
  }, [editor]);

  return (
    <div className="rich-editor-wrapper">
      {editor && <EditorContent editor={editor} />}
    </div>
  );
};

export default RichTextEditor;
