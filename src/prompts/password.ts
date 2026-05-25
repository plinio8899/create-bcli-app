import chalk from "chalk";
import type { Theme } from "../theme/index.js";
import { eraseLines, isTTY } from "../utils/ansi.js";
import { KeypressReader } from "../utils/keypress.js";

export function createPasswordPrompt(
  opts: { message: string; validate?: (v: string) => string | undefined },
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

    let value = "";
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
              `${chalk.red(theme.icons.error)} ${opts.message} ${chalk.red("*".repeat(Math.max(value.length, 1)))}\n`,
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
          `${chalk.green(theme.icons.success)} ${opts.message} ${chalk.green("*".repeat(value.length))}\n`,
        );
        resolve(value);
      } else if (event.name === "ctrl+c") {
        reader.stop();
        process.exit(0);
      } else if (event.name === "backspace") {
        value = value.slice(0, -1);
        const masked = "*".repeat(value.length);
        process.stdout.write(
          `\r${chalk.cyan(theme.icons.pointer)} ${opts.message} ${masked} `,
        );
      } else if (event.name === "escape") {
        reader.stop();
        resolve("");
      } else if (event.sequence.length === 1) {
        value += event.sequence;
        const masked = "*".repeat(value.length);
        process.stdout.write(
          `\r${chalk.cyan(theme.icons.pointer)} ${opts.message} ${masked} `,
        );
      }
    });
  });
}
