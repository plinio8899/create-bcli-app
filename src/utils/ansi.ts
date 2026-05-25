export const ESC = "\u001B[";
export const CSI = `${ESC}[`;

export function cursorHide(): string {
  return `${CSI}?25l`;
}

export function cursorShow(): string {
  return `${CSI}?25h`;
}

export function cursorUp(n = 1): string {
  return `${CSI + n}A`;
}

export function cursorDown(n = 1): string {
  return `${CSI + n}B`;
}

export function cursorForward(n = 1): string {
  return `${CSI + n}C`;
}

export function cursorBackward(n = 1): string {
  return `${CSI + n}D`;
}

export function eraseLine(): string {
  return `${CSI}K`;
}

export function eraseLines(n: number): string {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += eraseLine();
    if (i < n - 1) result += cursorUp();
  }
  return result;
}

export function clearScreen(): string {
  return `${CSI}2J${CSI}H`;
}

export function enableAlternateScreen(): string {
  return `${CSI}?1049h`;
}

export function disableAlternateScreen(): string {
  return `${CSI}?1049l`;
}

export const isTTY = process.stdout.isTTY && process.stdin.isTTY;
