import chalk, { type ChalkInstance } from "chalk";
import type { LoggerAPI } from "../core/types.js";
import type { Theme } from "../theme/index.js";

export function createLogger(theme: Theme): LoggerAPI {
  function prefix(icon: string, color: ChalkInstance, ...args: unknown[]) {
    const p = color(icon);
    const message = args.map((a) => String(a)).join(" ");
    console.log(`${p} ${message}`);
  }

  return {
    info(...args) {
      prefix(theme.icons.info, chalk.cyan, ...args);
    },
    success(...args) {
      prefix(theme.icons.success, chalk.green, ...args);
    },
    warn(...args) {
      prefix(theme.icons.warning, chalk.yellow, ...args);
    },
    error(...args) {
      prefix(theme.icons.error, chalk.red, ...args);
    },
    debug(...args) {
      if (process.env.DEBUG) {
        prefix("●", chalk.magenta, ...args);
      }
    },
    raw(...args) {
      console.log(...args);
    },
    table(data, columns) {
      const resolvedCols =
        columns ??
        (data.length > 0
          ? Object.keys(data[0]).map((k) => ({ key: k, label: k }))
          : []);

      if (data.length === 0) {
        console.log(chalk.dim("No data"));
        return;
      }

      const colWidths = resolvedCols.map((col) => {
        const headerLen = col.label.length;
        const maxDataLen = Math.max(
          ...data.map((row) => String(row[col.key] ?? "").length),
        );
        return Math.max(headerLen, maxDataLen) + 2;
      });

      const headerLine = resolvedCols
        .map((col, i) => chalk.bold(col.label.padEnd(colWidths[i])))
        .join("");

      const separator = resolvedCols
        .map((_col, i) => chalk.dim("─".repeat(colWidths[i])))
        .join(" ");

      const rows = data.map((row) =>
        resolvedCols
          .map((col, i) => String(row[col.key] ?? "").padEnd(colWidths[i]))
          .join(" "),
      );

      console.log(headerLine);
      console.log(separator);
      for (const r of rows) console.log(r);
    },
  };
}
