import insertTextAtCursor from "insert-text-at-cursor";


export const handleKeyDown = (e, text) => {
  if (e.ctrlKey && e.key === "b") {
    e.preventDefault();
    insertTextAtCursor(e.target, "**")
  } else if (e.ctrlKey && e.key === "i") {
    e.preventDefault();
    insertTextAtCursor(e.target, "*")
  }
};