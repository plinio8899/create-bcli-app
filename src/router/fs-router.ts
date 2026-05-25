import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ResolvedCommand } from "../core/types.js";

export interface FSRouterOptions {
  commandsDir: string;
  /** e.g. ['build', 'deploy'] from process.argv */
  segments: string[];
}

export class FSRouter {
  private commandsDir: string;
  private commandCache: Map<string, ResolvedCommand> = new Map();

  constructor(commandsDir: string) {
    this.commandsDir = commandsDir;
  }

  find(
    segments: string[],
  ): { command: ResolvedCommand; rest: string[] } | null {
    const cacheKey = segments.join("/");

    if (this.commandCache.has(cacheKey)) {
      const cached = this.commandCache.get(cacheKey);
      if (cached) return { command: cached, rest: [] };
    }

    // Try exact match first: commandsDir/segments.ts
    const exactPath = `${join(this.commandsDir, ...segments)}.ts`;
    if (existsSync(exactPath)) {
      const cmd = this.loadCommand(exactPath, segments);
      if (cmd) {
        this.commandCache.set(cacheKey, cmd);
        return { command: cmd, rest: [] };
      }
    }

    // Try index file: commandsDir/segments/index.ts
    const indexPath = join(this.commandsDir, ...segments, "index.ts");
    if (existsSync(indexPath)) {
      const cmd = this.loadCommand(indexPath, segments);
      if (cmd) {
        this.commandCache.set(cacheKey, cmd);
        return { command: cmd, rest: [] };
      }
    }

    // Walk backward: find the deepest matching command
    for (let i = segments.length - 1; i >= 0; i--) {
      const cmdSegments = segments.slice(0, i);
      const restSegments = segments.slice(i);
      const cmdPath = join(this.commandsDir, ...cmdSegments, "index.ts");
      if (existsSync(cmdPath)) {
        const cmd = this.loadCommand(cmdPath, cmdSegments);
        if (cmd) {
          this.commandCache.set(cacheKey, cmd);
          return { command: cmd, rest: restSegments };
        }
      }
      const cmdPath2 = `${join(this.commandsDir, ...cmdSegments)}.ts`;
      if (cmdSegments.length > 0 && existsSync(cmdPath2)) {
        const cmd = this.loadCommand(cmdPath2, cmdSegments);
        if (cmd) {
          this.commandCache.set(cacheKey, cmd);
          return { command: cmd, rest: restSegments };
        }
      }
    }

    // Fallback to root command
    const rootIndex = join(this.commandsDir, "index.ts");
    if (existsSync(rootIndex)) {
      const cmd = this.loadCommand(rootIndex, []);
      if (cmd) {
        this.commandCache.set(cacheKey, cmd);
        return { command: cmd, rest: segments };
      }
    }

    return null;
  }

  list(): ResolvedCommand[] {
    const commands: ResolvedCommand[] = [];
    this.discoverCommands(this.commandsDir, [], commands);
    return commands;
  }

  private discoverCommands(
    dir: string,
    segments: string[],
    result: ResolvedCommand[],
  ) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        this.discoverCommands(
          join(dir, entry.name),
          [...segments, entry.name],
          result,
        );
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".ts") &&
        entry.name !== "index.ts"
      ) {
        const name = entry.name.replace(/\.ts$/, "");
        const path = join(dir, entry.name);
        const cmd = this.loadCommand(path, [...segments, name]);
        if (cmd) result.push(cmd);
      } else if (
        entry.isFile() &&
        entry.name === "index.ts" &&
        segments.length > 0
      ) {
        const path = join(dir, entry.name);
        const cmd = this.loadCommand(path, segments);
        if (cmd) result.push(cmd);
      }
    }
  }

  private loadCommand(
    _filePath: string,
    segments: string[],
  ): ResolvedCommand | null {
    try {
      // Dynamic import — in real usage this would use the app's import system
      // For now we return a placeholder to show the structure
      return {
        path: segments,
        name: segments[segments.length - 1] || "index",
        description: "",
        args: {},
        flags: {},
        run: async () => {
          throw new Error("Commands must be loaded at runtime");
        },
      };
    } catch {
      return null;
    }
  }
}
