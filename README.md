<div align="center">
  <br/>
  <pre>
   ___ _     _        __ _    __ _
  | _ ) |___| |___   / _| |  / _(_)
  | _ \ / -_) / -_) |  _| |_|  _| |
  |___/_\___|_\___| |_| |____(_)_|
  </pre>
  <p><strong>Opinionated framework for building interactive CLI apps — by Billy.</strong></p>

  [![npm version](https://img.shields.io/npm/v/bcli)](https://www.npmjs.com/package/bcli)
  [![npm downloads](https://img.shields.io/npm/dw/bcli)](https://www.npmjs.com/package/bcli)
  [![License](https://img.shields.io/npm/l/bcli)](LICENSE)
  [![Node](https://img.shields.io/node/v/bcli)](https://nodejs.org)
  [![CI](https://github.com/plinio8899/create-bcli-app/actions/workflows/ci.yml/badge.svg)](https://github.com/plinio8899/create-bcli-app/actions/workflows/ci.yml)
  [![Docs](https://img.shields.io/badge/docs-vitepress-blue)](https://plinio8899.github.io/create-bcli-app/)

  <br/>
</div>

```bash
npm create bcli-app@latest my-cli
cd my-cli
npm start
```

Interactive prompts · File-system routing · Themes · Plugins · Built-in testing · 100% TypeScript

---

## Features

**🎯 Interactive Prompts** — text, select, multiselect, confirm, password, spinner — all themed out of the box.

**📁 File-System Routing** — `src/commands/deploy/rollback.ts` → `my-cli deploy rollback`. Zero config.

**🎨 4 Built-in Themes** — Nord, Dracula, One Dark, Minimal. Or bring your own. Icons, spinners, borders — everything adapts.

**🧪 Testing Included** — `bcliTest()` captures stdout, mocks prompts, validates output. No terminal required.

**🔌 Plugin System** — Extend any CLI with autocomplete, update checks, telemetry — plugins hook into the lifecycle.

**⚡ TypeScript Native** — Full type inference from config to commands. `defineConfig` and `defineCommand` are fully typed.

---

## Quick Start

### Scaffold a new CLI

```bash
npm create bcli-app@latest my-cli
cd my-cli
npm start
```

You'll get an interactive prompt asking for your name. That's it.

### Manual setup

```bash
npm install bcli
```

Create `src/bcli.config.ts`:

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

Create `src/commands/index.ts`:

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

Run it:

```bash
npx tsx src/cli.ts
```

---

## Project Structure

```
my-cli/
├── src/
│   ├── bcli.config.ts       # Framework configuration
│   └── commands/            # Commands = files
│       ├── index.ts         # → my-cli
│       ├── build.ts         # → my-cli build
│       └── deploy/
│           ├── index.ts     # → my-cli deploy
│           └── rollback.ts  # → my-cli deploy rollback
├── tests/
├── package.json
└── tsconfig.json
```

---

## Interactive Prompts

```typescript
// Text input with validation
const name = await prompt.text({
  message: 'What is your name?',
  validate: (v) => v.length < 2 ? 'Too short!' : undefined,
})

// Select from options
const color = await prompt.select({
  message: 'Pick a color',
  options: [
    { label: 'Red',   value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue',  value: 'blue' },
  ],
})

// Multi-select with space
const features = await prompt.multiselect({
  message: 'Select features',
  options: [
    { label: 'Logging',   value: 'logging' },
    { label: 'Analytics', value: 'analytics' },
  ],
})

// Confirm toggle
const ok = await prompt.confirm({
  message: 'Continue?',
  initial: true,
})

// Animated spinner
const spinner = prompt.spinner({ message: 'Loading...' })
await doWork()
spinner.succeed('Done!')
```

---

## Themes

```typescript
// Built-in: nord, dracula, one-dark, minimal
export default defineConfig({
  theme: 'dracula',
})

// Or custom
const myTheme = {
  name: 'Retro',
  colors: {
    primary: '#ff6b6b',
    success: '#6bcb77',
    // ...
  },
  spinner: {
    frames: ['|', '/', '-', '\\'],
    interval: 100,
  },
}

export default defineConfig({
  theme: myTheme,
})
```

---

## Testing

```typescript
import { describe, it, expect } from 'vitest'
import { bcliTest } from 'bcli/test'
import myCommand from '../src/commands/index.js'

it('greets the user', async () => {
  const { stdout } = await bcliTest(myCommand)
  expect(stdout).toContain('Hello')
})
```

Prompts are auto-mocked. Flags and args work the same as in the terminal.

---

## Documentation

Full documentation at:

### **[→ plinio8899.github.io/create-bcli-app](https://plinio8899.github.io/create-bcli-app/)**

Includes guides for installation, commands, arguments, routing, prompts, themes, testing, plugins, and the full API reference.

---

## Requirements

- **Node.js** >= 18
- **TypeScript** >= 5.0 (recommended)

## License

MIT — see [LICENSE](LICENSE).

---


<div align="center">
  <sub>Built with ❤️ by Billy</sub>
</div>
