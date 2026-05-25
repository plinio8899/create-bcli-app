import type { Theme } from "./index.js";

export const nord: Theme = {
  name: "Nord",
  colors: {
    primary: "#5E81AC",
    secondary: "#81A1C1",
    success: "#A3BE8C",
    error: "#BF616A",
    warning: "#EBCB8B",
    info: "#88C0D0",
    muted: "#616E88",
    border: "#4C566A",
    text: "#ECEFF4",
    highlight: "#D08770",
  },
  spinner: {
    frames: ["◜", "◝", "◞", "◟"],
    interval: 80,
  },
  border: {
    style: "rounded",
    color: "#4C566A",
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│",
  },
  icons: {
    success: "✔",
    error: "✘",
    warning: "⚠",
    info: "ℹ",
    bullet: "•",
    arrow: "▸",
    pointer: "❯",
    checkbox: "☐",
    checkboxChecked: "☑",
  },
};
