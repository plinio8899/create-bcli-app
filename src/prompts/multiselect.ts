import chalk from "chalk";
import type { Theme } from "../theme/index.js";
import { isTTY } from "../utils/ansi.js";
import { KeypressReader } from "../utils/keypress.js";

export function createMultiSelectPrompt<T extends string>(
  opts: {
    message: string;
    options: { label: string; value: T; hint?: string }[];
    initial?: T[];
  },
  theme: Theme,
): Promise<T[]> {
  return new Promise((resolve) => {
    if (!isTTY) {
      process.stdout.write(
        `${opts.message} [${opts.options.map((o) => o.label).join(", ")}]: `,
      );
      process.stdin.once("data", () => resolve([]));
      return;
    }

    let cursorIndex = 0;
    const selected = new Set<T>(opts.initial as T[]);

    const prefix = chalk.cyan(theme.icons.pointer);
    const pointer = chalk.cyan(theme.icons.pointer);

    function render() {
      let output = `${prefix} ${opts.message}\n`;
      for (let i = 0; i < opts.options.length; i++) {
        const opt = opts.options[i];
        const isCursor = i === cursorIndex;
        const isChecked = selected.has(opt.value);
        const checkbox = isChecked
          ? chalk.green(theme.icons.checkboxChecked)
          : chalk.dim(theme.icons.checkbox);
        const label = isCursor ? chalk.cyan(opt.label) : opt.label;
        const hint = opt.hint ? chalk.dim(` ${opt.hint}`) : "";
        output += ` ${isCursor ? pointer : " "} ${checkbox} ${label}${hint}\n`;
      }
      output += chalk.dim("  (space to toggle, enter to confirm)\n");
      return output;
    }

    process.stdout.write(render());

    const reader = new KeypressReader();
    reader.start();

    const lines = opts.options.length + 3;

    const _remove = reader.onKey((event) => {
      if (event.name === "enter") {
        reader.stop();
        for (let i = 0; i < lines; i++)
          process.stdout.write("\u001B[1A\u001B[K");
        const labels = opts.options
          .filter((o) => selected.has(o.value))
          .map((o) => o.label);
        process.stdout.write(
          `${chalk.green(theme.icons.success)} ${opts.message}: ${chalk.green(labels.join(", ") || "none")}\n`,
        );
        resolve([...selected]);
      } else if (event.name === "space") {
        const val = opts.options[cursorIndex].value;
        if (selected.has(val)) selected.delete(val);
        else selected.add(val);
        for (let i = 0; i < lines; i++) process.stdout.write("\u001B[1A");
        process.stdout.write(render());
      } else if (event.name === "up" || event.name === "k") {
        cursorIndex =
          cursorIndex > 0 ? cursorIndex - 1 : opts.options.length - 1;
        for (let i = 0; i < lines; i++) process.stdout.write("\u001B[1A");
        process.stdout.write(render());
      } else if (event.name === "down" || event.name === "j") {
        cursorIndex =
          cursorIndex < opts.options.length - 1 ? cursorIndex + 1 : 0;
        for (let i = 0; i < lines; i++) process.stdout.write("\u001B[1A");
        process.stdout.write(render());
      } else if (event.name === "ctrl+c") {
        reader.stop();
        process.exit(0);
      }
    });
  });
}
