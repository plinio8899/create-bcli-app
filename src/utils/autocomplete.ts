/**
 * Shell autocomplete generator for Craft CLIs.
 * Generates completion scripts for bash, zsh, and fish.
 */

import type {
  CraftConfig,
  FlagDefinition,
  ResolvedCommand,
} from "../core/types.js";

interface AutocompleteOpts {
  config: CraftConfig;
  commands: ResolvedCommand[];
  globalFlags: Record<string, FlagDefinition>;
}

export function generateAutocomplete(
  opts: AutocompleteOpts,
): Record<string, string> {
  return {
    bash: generateBash(opts),
    zsh: generateZsh(opts),
    fish: generateFish(opts),
  };
}

function generateBash({
  config,
  commands,
  globalFlags,
}: AutocompleteOpts): string {
  const bin = config.bin ?? config.name;

  let script = `_${bin}_completions() {\n`;
  script += `  local cur prev words cword\n`;
  script += `  _init_completion || return\n\n`;

  // Collect all command paths
  const cmdPaths = commands
    .filter((c) => c.path.length > 0)
    .map((c) => c.path.join(" "));

  // Collect flag names
  const flagNames = Object.keys(globalFlags).map((f) => `--${f}`);
  Object.entries(globalFlags).forEach(([_name, flag]) => {
    if (flag.alias) flagNames.push(`-${flag.alias}`);
  });

  script += `  if [[ $cword -eq 1 ]]; then\n`;
  script += `    COMPREPLY=($(compgen -W "${["--help", "--version", ...cmdPaths].join(" ")}" -- "$cur"))\n`;
  script += `  else\n`;
  script += `    COMPREPLY=($(compgen -W "${flagNames.join(" ")}" -- "$cur"))\n`;
  script += `  fi\n`;
  script += `}\n\n`;
  script += `complete -F _${bin}_completions ${bin}\n`;

  return script;
}

function generateZsh({
  config,
  commands,
  globalFlags,
}: AutocompleteOpts): string {
  const bin = config.bin ?? config.name;

  let script = `#compdef ${bin}\n\n`;
  script += `_${bin}() {\n`;
  script += `  local -a commands\n`;
  script += `  local -a flags\n\n`;

  // Commands
  const cmdDefs = commands
    .filter((c) => c.path.length > 0)
    .map(
      (c) => `    '${c.path.join(":")}:${c.description || c.path.join(" ")}'`,
    );
  script += `  commands=(\n${cmdDefs.join("\n")}\n  )\n\n`;

  // Flags
  const flagDefs = Object.entries(globalFlags).map(([name, flag]) => {
    const alias = flag.alias ? `-${flag.alias}[${flag.description}]` : "";
    const desc = flag.description ?? name;
    return `    '--${name}[${desc}]'${alias ? ` \\\n    '${alias}'` : ""}`;
  });
  script += `  flags=(\n${flagDefs.join("\n")}\n  )\n\n`;

  script += `  _arguments \\\n`;
  script += `    '(-h --help)'{-h,--help}'[Show help]' \\\n`;
  script += `    '(-v --version)'{-v,--version}'[Show version]' \\\n`;
  script += `    '*::command:->cmd' \\\n`;
  script += `    && return 0\n\n`;
  script += `  case $state in\n`;
  script += `    cmd)\n`;
  script += `      _describe 'command' commands\n`;
  script += `      ;;\n`;
  script += `  esac\n`;
  script += `}\n\n`;
  script += `_${bin}\n`;

  return script;
}

function generateFish({
  config,
  commands,
  globalFlags,
}: AutocompleteOpts): string {
  const bin = config.bin ?? config.name;

  let script = `# ${bin} completions for fish\n\n`;

  // Global flags
  for (const [name, flag] of Object.entries(globalFlags)) {
    const desc = flag.description ?? name;
    const alias = flag.alias ? ` -s ${flag.alias}` : "";
    script += `complete -c ${bin} -l ${name}${alias} -d '${desc}'\n`;
  }

  script += `complete -c ${bin} -l help -s h -d 'Show help'\n`;
  script += `complete -c ${bin} -l version -s v -d 'Show version'\n\n`;

  // Commands
  for (const cmd of commands.filter((c) => c.path.length > 0)) {
    const path = cmd.path.join(" ");
    const desc = cmd.description || path;
    script += `complete -c ${bin} -f -a '${path}' -d '${desc}'\n`;
  }

  return script;
}
