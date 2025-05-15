// src/components/editor/extensions/Subscript.js
import { Mark, mergeAttributes } from "@tiptap/core";

const Subscript = Mark.create({
  name: "subscript",

  parseHTML() {
    return [{ tag: "sub" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleSubscript:
        () =>
        ({ commands }) => {
          return commands.toggleMark("subscript");
        },
    };
  },
});

export default Subscript;
