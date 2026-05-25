import { existsSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { CraftConfig } from "./types.js";

export function defineConfig(config: CraftConfig): CraftConfig {
  return config;
}

export async function findConfig(rootDir: string): Promise<CraftConfig | null> {
  const candidates = [
    join(rootDir, "bcli.config.mjs"),
    join(rootDir, "bcli.config.js"),
    join(rootDir, "bcli.config.ts"),
  ];

  for (const filePath of candidates) {
    if (existsSync(filePath)) {
      try {
        const fileUrl = pathToFileURL(filePath).href;
        const mod = await import(fileUrl);
        return mod.default ?? mod;
      } catch (err) {
        throw new Error(`Failed to load config at ${filePath}\n  ${err}`);
      }
    }
  }

  return null;
}

export function defaultConfig(): CraftConfig {
  return {
    name: "cli",
    version: "1.0.0",
    theme: "nord",
    commandsDir: "./src/commands",
    flags: {
      help: { type: "boolean", alias: "h", description: "Show help" },
      version: { type: "boolean", alias: "v", description: "Show version" },
      verbose: { type: "boolean", alias: "V", description: "Verbose output" },
    },
  };
}

export function resolveConfig(userConfig: Partial<CraftConfig>): CraftConfig {
  return { ...defaultConfig(), ...userConfig };
}
