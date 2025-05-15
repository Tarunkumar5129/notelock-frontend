// src/components/editor/extensions/FontFamily.js
import { Mark, mergeAttributes } from "@tiptap/core";

const FontFamily = Mark.create({
  name: "fontFamily",

  addAttributes() {
    return {
      fontFamily: {
        default: null,
        parseHTML: (el) => el.style.fontFamily?.replace(/['"]/g, ""),
        renderHTML: (attrs) =>
          attrs.fontFamily ? { style: `font-family: ${attrs.fontFamily}` } : {},
      },
    };
  },

  parseHTML() {
    return [{ style: "font-family" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily) =>
        ({ commands }) =>
          commands.setMark(this.name, { fontFamily }),
    };
  },
});

export default FontFamily;
