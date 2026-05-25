import type { Theme } from "./index.js";

export const dracula: Theme = {
  name: "Dracula",
  colors: {
    primary: "#BD93F9",
    secondary: "#FF79C6",
    success: "#50FA7B",
    error: "#FF5555",
    warning: "#F1FA8C",
    info: "#8BE9FD",
    muted: "#6272A4",
    border: "#44475A",
    text: "#F8F8F2",
    highlight: "#FFB86C",
  },
  spinner: {
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    interval: 80,
  },
  border: {
    style: "rounded",
    color: "#44475A",
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
  },
  icons: {
    success: "✓",
    error: "✗",
    warning: "⚡",
    info: "→",
    bullet: "·",
    arrow: "▸",
    pointer: "▶",
    checkbox: "◻",
    checkboxChecked: "◼",
  },
};
