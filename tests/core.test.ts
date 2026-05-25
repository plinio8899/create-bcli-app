import { describe, it, expect } from 'vitest'
import { defineConfig, defineCommand, definePlugin, defineMiddleware, parseFlags, parseArgs, validate } from '../src/index.js'
import { resolveTheme, builtinThemes } from '../src/theme/index.js'
import type { Theme } from '../src/theme/index.js'

describe('defineConfig', () => {
  it('creates a config with defaults', () => {
    const config = defineConfig({ name: 'test', version: '1.0.0' })
    expect(config.name).toBe('test')
    expect(config.version).toBe('1.0.0')
    expect(config.theme).toBeUndefined()
  })

  it('merges custom flags', () => {
    const config = defineConfig({
      name: 'test',
      version: '1.0.0',
      flags: {
        verbose: { type: 'boolean', alias: 'V', description: 'Verbose' },
      },
    })
    expect(config.flags?.verbose.alias).toBe('V')
  })
})

describe('defineCommand', () => {
  it('creates a command definition', () => {
    const cmd = defineCommand({
      description: 'Test command',
      run: () => 'hello',
    })
    expect(cmd.description).toBe('Test command')
  })

  it('supports args and flags', () => {
    const cmd = defineCommand({
      description: 'Build',
      args: { target: { type: 'string', required: true } },
      flags: { watch: { type: 'boolean', alias: 'w' } },
      run: () => {},
    })
    expect(cmd.args?.target.required).toBe(true)
    expect(cmd.flags?.watch.alias).toBe('w')
  })
})

describe('parseFlags', () => {
  it('parses --flag value', () => {
    const { flags } = parseFlags(['--name', 'john'], {
      name: { type: 'string' },
    })
    expect(flags.name).toBe('john')
  })

  it('parses --flag=value', () => {
    const { flags } = parseFlags(['--name=john'], {
      name: { type: 'string' },
    })
    expect(flags.name).toBe('john')
  })

  it('parses boolean flags', () => {
    const { flags } = parseFlags(['--verbose'], {
      verbose: { type: 'boolean' },
    })
    expect(flags.verbose).toBe(true)
  })

  it('parses -a alias', () => {
    const { flags } = parseFlags(['-V'], {
      verbose: { type: 'boolean', alias: 'V' },
    })
    expect(flags.verbose).toBe(true)
  })

  it('handles defaults', () => {
    const { flags } = parseFlags([], {
      port: { type: 'number', default: 3000 },
    })
    expect(flags.port).toBe(3000)
  })

  it('stops parsing at --', () => {
    const { flags, rest } = parseFlags(['--name', 'john', '--', 'extra'], {
      name: { type: 'string' },
    })
    expect(flags.name).toBe('john')
    expect(rest).toEqual(['extra'])
  })
})

describe('parseArgs', () => {
  it('parses positional args', () => {
    const args = parseArgs(['hello', 'world'], {
      input: { type: 'string', required: true },
      output: { type: 'string' },
    })
    expect(args.input).toBe('hello')
    expect(args.output).toBe('world')
  })

  it('applies defaults', () => {
    const args = parseArgs([], {
      name: { type: 'string', default: 'default-name' },
    })
    expect(args.name).toBe('default-name')
  })
})

describe('validate', () => {
  it('returns null when valid', () => {
    const err = validate({ name: 'test' }, {
      name: { type: 'string', required: true },
    })
    expect(err).toBeNull()
  })

  it('returns error when required arg missing', () => {
    const err = validate({}, {
      name: { type: 'string', required: true },
    })
    expect(err).toContain('Missing required')
  })

  it('validates choices', () => {
    const err = validate({ env: 'invalid' }, {
      env: { type: 'string', choices: ['dev', 'prod'] },
    })
    expect(err).toContain('Invalid value')
  })
})

describe('resolveTheme', () => {
  it('resolves builtin themes by name', () => {
    const theme = resolveTheme('nord')
    expect(theme.name).toBe('Nord')
  })

  it('resolves custom themes', () => {
    const custom: Theme = {
      name: 'Custom',
      colors: { primary: '#000', secondary: '#111', success: '#0f0', error: '#f00', warning: '#ff0', info: '#0ff', muted: '#888', border: '#666', text: '#fff', highlight: '#f0f' },
      spinner: { frames: ['|'], interval: 100 },
      border: { style: 'single', color: '#666', topLeft: '+', topRight: '+', bottomLeft: '+', bottomRight: '+', horizontal: '-', vertical: '|' },
      icons: { success: '+', error: 'x', warning: '!', info: 'i', bullet: '-', arrow: '>', pointer: '>', checkbox: '[ ]', checkboxChecked: '[x]' },
    }
    expect(resolveTheme(custom)).toBe(custom)
  })

  it('returns nord for undefined', () => {
    expect(resolveTheme(undefined).name).toBe('Nord')
  })
})

describe('builtinThemes', () => {
  it('has all themes', () => {
    expect(Object.keys(builtinThemes)).toEqual(['nord', 'dracula', 'one-dark', 'minimal'])
  })
})

describe('definePlugin', () => {
  it('creates a plugin definition', () => {
    const plugin = definePlugin({
      name: 'test-plugin',
      setup: (config) => config,
    })
    expect(plugin.name).toBe('test-plugin')
    expect(typeof plugin.setup).toBe('function')
  })
})

describe('defineMiddleware', () => {
  it('creates a middleware definition', () => {
    const mw = defineMiddleware({
      phase: 'preRun',
      run: () => {},
    })
    expect(mw.phase).toBe('preRun')
  })
})
