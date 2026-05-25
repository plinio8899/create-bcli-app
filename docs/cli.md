# CLI Reference

Reference for `bcli` (the runner) and `create-bcli-app` (the scaffolding tool).

## `create-bcli-app`

Scaffold a new CLI project.

```bash
npm create bcli-app@latest [project-name]
```

### Interactive Prompts

```
? Project name: my-cli
? Theme (nord/dracula/one-dark/minimal): nord
? Package manager (npm/pnpm/yarn/bun): npm
? Include interactive examples? (Y/n): y
```

### What It Creates

```
my-cli/
├── src/
│   ├── bcli.config.ts
│   └── commands/
│       ├── index.ts
│       └── build.ts
├── tests/
│   └── index.test.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

## `bcli` (Runner)

The `bcli` command is the entry point for end-user CLIs.

```bash
npx bcli [command] [args] [flags]
```

### Global Flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--help` | `-h` | Show help |
| `--version` | `-v` | Show version |
| `--verbose` | `-V` | Verbose output |

### Auto-completion

Generate shell completions:

```bash
# bash
source <(bcli completion bash)

# zsh
source <(bcli completion zsh)

# fish
bcli completion fish | source
```

## Exit Codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid usage |
| `130` | Cancelled (Ctrl+C) |
