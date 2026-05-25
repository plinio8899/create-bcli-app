import chalk from "chalk";
import type { Theme } from "../theme/index.js";
import { eraseLines, isTTY } from "../utils/ansi.js";
import { KeypressReader } from "../utils/keypress.js";

export function createTextPrompt(
  opts: {
    message: string;
    placeholder?: string;
    initial?: string;
    validate?: (v: string) => string | undefined;
  },
  theme: Theme,
): Promise<string> {
  return new Promise((resolve) => {
    if (!isTTY) {
      process.stdout.write(`${opts.message}: `);
      process.stdin.once("data", (data) => {
        resolve(data.toString().trim());
      });
      return;
    }

    let value = opts.initial ?? "";
    let error = "";
    const prefix = chalk.cyan(theme.icons.pointer);
    process.stdout.write(`${prefix} ${opts.message} `);

    const reader = new KeypressReader();
    reader.start();

    const _remove = reader.onKey((event) => {
      if (event.name === "enter") {
        if (opts.validate) {
          const err = opts.validate(value);
          if (err) {
            error = err;
            process.stdout.write(eraseLines(1));
            process.stdout.write(
              `${chalk.red(theme.icons.error)} ${opts.message} ${chalk.red(value)}\n`,
            );
            process.stdout.write(`  ${chalk.red(error)}\n`);
            process.stdout.write(
              `${chalk.cyan(theme.icons.pointer)} ${opts.message} `,
            );
            return;
          }
        }
        reader.stop();
        process.stdout.write(eraseLines(1));
        process.stdout.write(
          `${chalk.green(theme.icons.success)} ${opts.message} ${chalk.green(value || "<empty>")}\n`,
        );
        resolve(value);
      } else if (event.name === "ctrl+c") {
        reader.stop();
        process.exit(0);
      } else if (event.name === "backspace") {
        value = value.slice(0, -1);
        process.stdout.write(
          `\r${chalk.cyan(theme.icons.pointer)} ${opts.message} ${value} `,
        );
      } else if (event.name === "escape") {
        value = opts.initial ?? "";
        resolve(value);
      } else if (event.sequence.length === 1) {
        value += event.sequence;
        process.stdout.write(
          `\r${chalk.cyan(theme.icons.pointer)} ${opts.message} ${value} `,
        );
      }
    });
  });
}
