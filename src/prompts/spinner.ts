import chalk from "chalk";
import type { SpinnerAPI } from "../core/types.js";
import type { Theme } from "../theme/index.js";
import { isTTY } from "../utils/ansi.js";

export function createSpinner(
  initialMessage: string,
  theme: Theme,
): SpinnerAPI {
  let frameIndex = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let message = initialMessage;
  let _isRunning = false;
  let isDone = false;

  const { frames } = theme.spinner;

  function _render() {
    const frame = frames[frameIndex % frames.length];
    process.stdout.write(`\r${frame} ${message}`);
    frameIndex++;
  }

  return {
    message(text: string) {
      message = text;
    },
    succeed(text?: string) {
      if (isDone) return;
      this.stop();
      const icon = chalk.green(theme.icons.success);
      process.stdout.write(`\r${icon} ${text ?? message}\n`);
      isDone = true;
    },
    fail(text?: string) {
      if (isDone) return;
      this.stop();
      const icon = chalk.red(theme.icons.error);
      process.stdout.write(`\r${icon} ${text ?? message}\n`);
      isDone = true;
    },
    warn(text?: string) {
      if (isDone) return;
      this.stop();
      const icon = chalk.yellow(theme.icons.warning);
      process.stdout.write(`\r${icon} ${text ?? message}\n`);
      isDone = true;
    },
    stop() {
      if (isDone) return;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      _isRunning = false;
      process.stdout.write("\r");
      if (!isTTY) process.stdout.write("\n");
    },
  };
}
