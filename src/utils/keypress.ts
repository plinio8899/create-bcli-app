import { isTTY } from "./ansi.js";

const KEY_MAPPING: Record<string, string> = {
  "\r": "enter",
  "\n": "enter",
  " ": "space",
  "\u001b[A": "up",
  "\u001b[B": "down",
  "\u001b[C": "right",
  "\u001b[D": "left",
  "\u001b[H": "home",
  "\u001b[F": "end",
  "\u001b[Z": "tab",
  "\u001b[3~": "delete",
  "\u001b[5~": "pageup",
  "\u001b[6~": "pagedown",
  "\u007f": "backspace",
  "\u001b": "escape",
  "\u0003": "ctrl+c",
  "\u0004": "ctrl+d",
  "\u001bb": "alt+left",
  "\u001bf": "alt+right",
};

export interface KeypressEvent {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  sequence: string;
  raw: Buffer | null;
}

export type KeypressHandler = (event: KeypressEvent) => void | boolean;

export class KeypressReader {
  private handlers: Set<KeypressHandler> = new Set();
  private rawMode = false;

  start(): void {
    if (!isTTY || !process.stdin.isTTY) return;
    process.stdin.setRawMode(true);
    process.stdin.resume();
    this.rawMode = true;
    process.stdin.on("data", this.onData);
  }

  stop(): void {
    if (!this.rawMode) return;
    process.stdin.setRawMode(false);
    process.stdin.pause();
    this.rawMode = false;
    process.stdin.off("data", this.onData);
    this.handlers.clear();
  }

  onKey(handler: KeypressHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private onData = (data: Buffer): void => {
    const sequence = data.toString();
    const rawName = KEY_MAPPING[sequence];
    const event: KeypressEvent = {
      name: rawName ?? sequence,
      ctrl: sequence.charCodeAt(0) < 32 && !KEY_MAPPING[sequence],
      meta: sequence.length > 1 && !KEY_MAPPING[sequence],
      shift: sequence.length === 1 && sequence >= "A" && sequence <= "Z",
      sequence,
      raw: data,
    };
    let handled = false;
    for (const handler of this.handlers) {
      const result = handler(event);
      if (result === true) handled = true;
    }
    if (!handled && event.name === "ctrl+c") process.exit(0);
  };
}
