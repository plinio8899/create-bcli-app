# Getting Started

Create a new CLI project in seconds.

## Quick Start

```bash
npm create bcli-app@latest my-cli
cd my-cli
npm start
```

That's it. You'll get an interactive prompt asking for your name.

## What You Get

```
my-cli/
├── src/
│   ├── bcli.config.ts       # Your CLI configuration
│   └── commands/
│       ├── index.ts          # Root command
│       └── build.ts          # `my-cli build`
├── package.json
└── tsconfig.json
```

Every file is **fully typed** — open it in your editor and you'll get autocomplete for everything.

## Manual Install

If you prefer to set up manually:

```bash
npm install bcli
```

Then create `src/bcli.config.ts`:

```typescript
import { defineConfig } from 'bcli'

export default defineConfig({
  name: 'my-cli',
  version: '0.1.0',
  description: 'My awesome CLI',
  theme: 'nord',
  commandsDir: './src/commands',
})
```

And a command at `src/commands/index.ts`:

```typescript
import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Say hello',
  run: async ({ prompt, logger }) => {
    const name = await prompt.text({
      message: 'What is your name?',
    })
    logger.success(`Hello, ${name}!`)
  },
})
```

## Requirements

- **Node.js** >= 18
- **TypeScript** >= 5.0 (recommended)

## Next Steps

- Learn about the [CLI structure](/structure)
- See all [configuration options](/configuration)
- Explore [interactive prompts](/prompts)
