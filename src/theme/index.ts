export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  muted: string;
  border: string;
  text: string;
  highlight: string;
}

export interface ThemeSpinner {
  frames: string[];
  interval: number;
}

export interface ThemeBorder {
  style: "rounded" | "single" | "double" | "none";
  color: string;
  topLeft?: string;
  topRight?: string;
  bottomLeft?: string;
  bottomRight?: string;
  horizontal?: string;
  vertical?: string;
}

export interface ThemeIcons {
  success: string;
  error: string;
  warning: string;
  info: string;
  bullet: string;
  arrow: string;
  pointer: string;
  checkbox: string;
  checkboxChecked: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  spinner: ThemeSpinner;
  border: ThemeBorder;
  icons: ThemeIcons;
}

import { dracula } from "./dracula.js";
import { minimal } from "./minimal.js";
import { nord } from "./nord.js";
import { oneDark } from "./one-dark.js";

export const builtinThemes: Record<string, Theme> = {
  nord,
  dracula,
  "one-dark": oneDark,
  minimal,
};

export function resolveTheme(nameOrTheme: string | Theme | undefined): Theme {
  if (!nameOrTheme) return nord;
  if (typeof nameOrTheme === "object") return nameOrTheme;
  return builtinThemes[nameOrTheme] ?? nord;
}
