import type { Theme } from "./index.js";

export const oneDark: Theme = {
  name: "One Dark",
  colors: {
    primary: "#61AFEF",
    secondary: "#C678DD",
    success: "#98C379",
    error: "#E06C75",
    warning: "#E5C07B",
    info: "#56B6C2",
    muted: "#5C6370",
    border: "#3E4451",
    text: "#ABB2BF",
    highlight: "#D19A66",
  },
  spinner: {
    frames: ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"],
    interval: 80,
  },
  border: {
    style: "rounded",
    color: "#3E4451",
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
    warning: "‼",
    info: "ℹ",
    bullet: "●",
    arrow: "▸",
    pointer: "❯",
    checkbox: "◌",
    checkboxChecked: "◉",
  },
};
