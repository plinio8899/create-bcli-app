# File-System Routing

Commands map directly to your file tree. No configuration needed.

## How It Works

```
src/commands/
├── index.ts           → my-cli
├── build.ts           → my-cli build
├── deploy/
│   ├── index.ts       → my-cli deploy
│   └── rollback.ts    → my-cli deploy rollback
```

**Rules:**

| File | Command |
|------|---------|
| `commands/index.ts` | `my-cli` (root) |
| `commands/foo.ts` | `my-cli foo` |
| `commands/foo/index.ts` | `my-cli foo` |
| `commands/foo/bar.ts` | `my-cli foo bar` |
| `commands/[...rest].ts` | Catch-all |

## Deep Nesting

You can nest as deep as you want:

```typescript
// src/commands/namespace/group/action.ts
export default defineCommand({
  description: 'A deeply nested command',
  run: () => console.log('This runs on: my-cli namespace group action')
})
```

## Catch-all Routes

For dynamic segments (like `my-cli plugin <name>`):

```typescript
// src/commands/plugin/[name].ts
export default defineCommand({
  description: 'Manage plugins',
  args: {
    name: { type: 'string', description: 'Plugin name' },
  },
  run: async ({ args }) => {
    console.log(`Managing plugin: ${args.name}`)
  },
})
```

## Index Files

An `index.ts` in any directory becomes the command for that path:

```typescript
// src/commands/deploy/index.ts → my-cli deploy
// src/commands/deploy/status.ts → my-cli deploy status
```

The index file receives any "extra" arguments that don't match subcommands:

```bash
my-cli deploy --env prod    # runs deploy/index.ts with flags
my-cli deploy status        # runs deploy/status.ts
```

## Why File-System Routing?

- **Zero boilerplate** — add a file, get a command
- **Discoverable** — look at the folder, see all commands
- **Refactorable** — move a file, rename a command
- **Familiar** — same pattern as Next.js, SvelteKit, etc.
