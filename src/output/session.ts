import type { SessionAPI } from "../core/types.js";
import { cursorHide, cursorShow } from "../utils/ansi.js";

export function createSession(
  onStart?: () => void,
  onStop?: (code: number) => void,
): SessionAPI {
  return {
    start() {
      process.stdout.write(cursorHide());
      onStart?.();
    },
    stop(exitCode = 0) {
      process.stdout.write(cursorShow());
      onStop?.(exitCode);
      process.exit(exitCode);
    },
  };
}
