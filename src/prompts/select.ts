import chalk from "chalk";
import type { Theme } from "../theme/index.js";
import { isTTY } from "../utils/ansi.js";
import { KeypressReader } from "../utils/keypress.js";

export function createSelectPrompt<T extends string>(
  opts: {
    message: string;
    options: { label: string; value: T; hint?: string }[];
    initial?: T;
  },
  theme: Theme,
): Promise<T> {
  return new Promise((resolve) => {
    if (!isTTY) {
      process.stdout.write(
        `${opts.message} [${opts.options.map((o) => o.label).join(", ")}]: `,
      );
      process.stdin.once("data", () => resolve(opts.options[0].value));
      return;
    }

    let selectedIndex = opts.initial
      ? opts.options.findIndex((o) => o.value === opts.initial)
      : 0;
    if (selectedIndex < 0) selectedIndex = 0;

    const prefix = chalk.cyan(theme.icons.pointer);
    const pointer = chalk.cyan(theme.icons.pointer);

    function render() {
      let output = `${prefix} ${opts.message}\n`;
      for (let i = 0; i < opts.options.length; i++) {
        const opt = opts.options[i];
        const isSelected = i === selectedIndex;
        const line = isSelected
          ? ` ${pointer} ${chalk.cyan(opt.label)}`
          : `   ${opt.label}`;
        const hint = opt.hint ? chalk.dim(` ${opt.hint}`) : "";
        output += `${line + hint}\n`;
      }
      return output;
    }

    process.stdout.write(render());

    const reader = new KeypressReader();
    reader.start();

    const lines = opts.options.length + 2;

    const _remove = reader.onKey((event) => {
      if (event.name === "enter") {
        reader.stop();
        const selected = opts.options[selectedIndex].value;
        const linesUp = lines;
        for (let i = 0; i < linesUp; i++)
          process.stdout.write("\u001B[1A\u001B[K");
        process.stdout.write(
          `${chalk.green(theme.icons.success)} ${opts.message}: ${chalk.green(opts.options[selectedIndex].label)}\n`,
        );
        resolve(selected);
      } else if (event.name === "up" || event.name === "k") {
        selectedIndex =
          selectedIndex > 0 ? selectedIndex - 1 : opts.options.length - 1;
        for (let i = 0; i < lines; i++) process.stdout.write("\u001B[1A");
        process.stdout.write(render());
      } else if (event.name === "down" || event.name === "j") {
        selectedIndex =
          selectedIndex < opts.options.length - 1 ? selectedIndex + 1 : 0;
        for (let i = 0; i < lines; i++) process.stdout.write("\u001B[1A");
        process.stdout.write(render());
      } else if (event.name === "ctrl+c") {
        reader.stop();
        process.exit(0);
      }
    });
  });
}
