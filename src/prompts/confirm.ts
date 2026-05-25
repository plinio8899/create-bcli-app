import chalk from "chalk";
import type { Theme } from "../theme/index.js";
import { isTTY } from "../utils/ansi.js";
import { KeypressReader } from "../utils/keypress.js";

export function createConfirmPrompt(
  opts: { message: string; initial?: boolean },
  theme: Theme,
): Promise<boolean> {
  return new Promise((resolve) => {
    if (!isTTY) {
      process.stdout.write(`${opts.message} (y/n): `);
      process.stdin.once("data", (data) => {
        const val = data.toString().trim().toLowerCase();
        resolve(val === "y" || val === "yes");
      });
      return;
    }

    let value = opts.initial ?? true;
    const prefix = chalk.cyan(theme.icons.pointer);

    function render() {
      const yes = value ? chalk.cyan("Yes") : "Yes";
      const no = !value ? chalk.cyan("No") : "No";
      return `${prefix} ${opts.message} ${yes}/${no}`;
    }

    process.stdout.write(render());

    const reader = new KeypressReader();
    reader.start();

    const _remove = reader.onKey((event) => {
      if (event.name === "enter") {
        reader.stop();
        process.stdout.write(
          `\r${chalk.green(theme.icons.success)} ${opts.message}: ${chalk.green(value ? "Yes" : "No")}\n`,
        );
        resolve(value);
      } else if (event.name === "left" || event.name === "right") {
        value = !value;
        process.stdout.write(`\r${render()} `);
      } else if (event.name === "ctrl+c") {
        reader.stop();
        process.exit(0);
      }
    });
  });
}
