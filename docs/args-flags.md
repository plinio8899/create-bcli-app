# Arguments & Flags

bcli has a powerful but simple argument parser built in.

## Parsing Rules

### Positional Arguments

```bash
my-cli <input> <output>
```

Mapped by order in the `args` definition:

```typescript
args: {
  input:  { type: 'string', required: true },
  output: { type: 'string', default: './dist' },
}
```

### Named Flags

```bash
my-cli --port 8080 --verbose
my-cli -p 8080 -V
my-cli --config=prod.json
```

### Boolean Flags

```bash
# --flag sets to true
my-cli --verbose        # verbose = true

# --no-flag sets to false
my-cli --no-verbose     # verbose = false
```

### Combining Short Flags

```bash
my-cli -abc             # same as -a -b -c
```

### The `--` Separator

Everything after `--` is treated as positional, not parsed:

```bash
my-cli build -- --extra-arg
```

## Validation

Required arguments trigger a user-friendly error:

```bash
$ my-cli
✘ Missing required argument: input
```

Choices validation:

```typescript
args: {
  env: { type: 'string', choices: ['dev', 'staging', 'prod'] }
}
```

```bash
$ my-cli --env test
✘ Invalid value for env: must be one of [dev, staging, prod]
```

## Auto-generated Help

Every flag and argument automatically appears in `--help`:

```bash
$ my-cli build --help

my-cli v1.0.0

Usage:
  my-cli build [args] [flags]

Arguments:
  target    (required) [choices: dev, prod]

Flags:
  -w, --watch    Watch mode
  -V, --verbose  Verbose output
```
