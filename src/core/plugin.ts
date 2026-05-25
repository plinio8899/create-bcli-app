import type { CraftConfig, PluginDefinition } from "./types.js";

export function definePlugin(def: PluginDefinition): PluginDefinition {
  return def;
}

export function resolvePlugins(
  plugins: PluginDefinition[],
  config: CraftConfig,
): CraftConfig {
  let resolved = { ...config };
  for (const plugin of plugins) {
    const result = plugin.setup(resolved);
    if (result) resolved = result;
  }
  return resolved;
}
