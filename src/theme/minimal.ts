import type { Theme } from "./index.js";

export const minimal: Theme = {
  name: "Minimal",
  colors: {
    primary: "#ffffff",
    secondary: "#cccccc",
    success: "#00ff00",
    error: "#ff0000",
    warning: "#ffff00",
    info: "#00ffff",
    muted: "#888888",
    border: "#666666",
    text: "#ffffff",
    highlight: "#ff00ff",
  },
  spinner: {
    frames: ["|", "/", "-", "\\"],
    interval: 120,
  },
  border: {
    style: "single",
    color: "#666666",
    topLeft: "+",
    topRight: "+",
    bottomLeft: "+",
    bottomRight: "+",
    horizontal: "-",
    vertical: "|",
  },
  icons: {
    success: "+",
    error: "x",
    warning: "!",
    info: "i",
    bullet: "-",
    arrow: ">",
    pointer: ">",
    checkbox: "[ ]",
    checkboxChecked: "[x]",
  },
};
