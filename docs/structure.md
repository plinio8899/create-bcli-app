# CLI Structure

bcli is opinionated about project structure — and that's a good thing.

## The Golden Rule

**Every file in `src/commands/` becomes a command.**

```
src/commands/
├── index.ts           → my-cli (root)
├── build.ts           → my-cli build
├── deploy/
│   ├── index.ts       → my-cli deploy
│   └── rollback.ts    → my-cli deploy rollback
```

The file path maps directly to the command name. No decorators, no manual registration.

## Full Project Layout

```
my-cli/
├── src/
│   ├── bcli.config.ts       # Required — framework configuration
│   ├── commands/            # Command definitions (file = command)
│   │   ├── index.ts
│   │   ├── build.ts
│   │   └── deploy/
│   │       ├── index.ts
│   │       ├── rollback.ts
│   │       └── status.ts
│   ├── middlewares/          # Global lifecycle hooks
│   │   └── auth.ts
│   └── prompts/             # Reusable prompt definitions
│       └── config-wizard.ts
├── tests/                   # Test files (mirrors src/)
│   └── commands/
│       └── build.test.ts
├── package.json
├── tsconfig.json
└── bcli.config.ts
```

## The Config File (`bcli.config.ts`)

This is the heart of your CLI. It defines everything:

```typescript
import { defineConfig } from 'bcli'

export default defineConfig({
  name: 'my-cli',          // Used in help, version, logs
  version: '1.0.0',        // Displayed with --version
  description: '...',
  theme: 'nord',           // nord | dracula | one-dark | minimal
  commandsDir: './src/commands',

  // Global flags — available to every command
  flags: {
    verbose: { type: 'boolean', alias: 'V', description: 'Verbose output' },
  },

  plugins: [],
  middlewares: [],
})
```

## Why So Opinionated?

Because every CLI should feel familiar. When you use `npm`, `git`, `docker`, or `next dev`, they share a common UX. bcli enforces that same muscle memory:

```
my-cli [command] [args] [flags]
```

Users never guess how your CLI works. It just works.
