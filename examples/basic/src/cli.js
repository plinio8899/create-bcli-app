#!/usr/bin/env node

import {
  defineCommand,
  defineConfig,
  resolveTheme,
  createPromptAPI,
  createLogger,
} from 'bcli'

const config = defineConfig({
  name: 'hello-billy',
  version: '0.1.0',
  description: 'Example CLI for bcli framework',
  theme: 'nord',
})

const greet = defineCommand({
  description: 'Greet someone interactively',
  run: async ({ prompt, logger }) => {
    const name = await prompt.text({
      message: 'What is your name?',
      placeholder: 'Enter name',
    })

    const color = await prompt.select({
      message: 'Pick a favorite color',
      options: [
        { label: 'Red', value: 'red' },
        { label: 'Green', value: 'green' },
        { label: 'Blue', value: 'blue' },
      ],
    })

    const confirmed = await prompt.confirm({
      message: `Continue with color ${color}?`,
      initial: true,
    })

    if (!confirmed) {
      logger.info('Maybe next time!')
      return
    }

    const features = await prompt.multiselect({
      message: 'Select extras (space to toggle)',
      options: [
        { label: 'Logging', value: 'logging', hint: '(detailed logs)' },
        { label: 'Cache', value: 'cache', hint: '(faster)' },
        { label: 'Analytics', value: 'analytics', hint: '(track usage)' },
      ],
    })

    const spinner = prompt.spinner({ message: 'Processing...' })
    await new Promise(r => setTimeout(r, 1000))
    spinner.succeed('Done!')

    logger.success(`Hello, ${name}!`)
    logger.info(`Color: ${color}, Features: ${features.join(', ')}`)
  },
})

const build = defineCommand({
  description: 'Build the project',
  run: async ({ prompt, logger }) => {
    const spinner = prompt.spinner({ message: 'Building...' })
    await new Promise(r => setTimeout(r, 1500))
    spinner.succeed('Build complete!')

    logger.table(
      [
        { file: 'index.js', size: '12 KB' },
        { file: 'styles.css', size: '4 KB' },
      ],
      [
        { key: 'file', label: 'File' },
        { key: 'size', label: 'Size' },
      ],
    )
  },
})

const passwordDemo = defineCommand({
  description: 'Demo password prompt',
  run: async ({ prompt, logger }) => {
    const secret = await prompt.password({
      message: 'Enter a secret:',
      validate: (v) => v.length < 3 ? 'Must be at least 3 characters' : undefined,
    })
    logger.success(`Secret stored (${secret.length} chars)`)
  },
})

const commands = { greet, build, password: passwordDemo }

async function main() {
  const rawArgs = process.argv.slice(2)

  if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
    console.log(`\n  ${config.name} v${config.version}\n`)
    for (const [name, cmd] of Object.entries(commands)) {
      console.log(`  ${name}`)
      console.log(`    ${cmd.description}\n`)
    }
    console.log('Run `node src/cli.js <command>`\n')
    return
  }

  const cmdName = rawArgs[0]
  if (!cmdName || !commands[cmdName]) {
    console.error(`Unknown command: ${cmdName || ''}`)
    console.error('Available: ' + Object.keys(commands).join(', '))
    process.exit(1)
  }

  const cmd = commands[cmdName]
  const theme = resolveTheme(config.theme)
  const prompt = createPromptAPI(theme)
  const logger = createLogger(theme)

  await cmd.run({
    args: {},
    flags: {},
    globalFlags: {},
    command: { path: [cmdName], name: cmdName, description: cmd.description ?? '', args: {}, flags: {}, run: cmd.run },
    config,
    prompt,
    logger,
    session: { start: () => {}, stop: (c) => process.exit(c ?? 0) },
  })
}

main().catch((err) => {
  console.error(String(err))
  process.exit(1)
})
