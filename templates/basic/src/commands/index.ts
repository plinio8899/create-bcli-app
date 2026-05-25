import { defineCommand } from 'bcli'

export default defineCommand({
  description: 'Main entry point',
  run: async ({ prompt, logger, session }) => {
    const name = await prompt.text({
      message: 'What is your name?',
      placeholder: 'Enter your name',
    })

    logger.success(`Hello, ${name}!`)
    logger.info('This is bcli — the opinionated CLI framework by Billy.')

    const spinner = prompt.spinner({ message: 'Doing something...' })
    await new Promise(r => setTimeout(r, 1000))
    spinner.succeed('Done!')
  },
})
