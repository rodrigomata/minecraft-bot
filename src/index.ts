import { query as q } from 'faunadb'

import DiscordClient from './plugins/discord'
import faunaClient from './plugins/fauna'
import { createFuse } from './plugins/fuse'

import type { ChatInputCommandInteraction } from 'discord.js'

const discordBot = new DiscordClient()
const discordClient = discordBot.getClient()

// When bot is ready
discordClient.on('ready', () => {
  console.log('Bot is ready')
})

// When a command is received
discordClient.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const command = interaction.commandName as Command

  switch (command) {
    case 'register': {
      await registerAction(interaction as ChatInputCommandInteraction)
      break
    }

    case 'find': {
      await findAction(interaction as ChatInputCommandInteraction)
      break
    }
    default:
      interaction.reply('Unknown command')
      break
  }
})

discordBot.loginClient()

async function registerAction(interaction: ChatInputCommandInteraction) {
  const options = interaction.options
  const x = options.getNumber('x', true)
  const z = options.getNumber('z', true)
  const description = options.getString('description', true)

  const newLocation = { x, z, description }

  await faunaClient.query(q.Create(q.Collection('locations'), { data: newLocation }))

  return interaction.reply(`Location registered: X: ${x} | Z: ${z} | Description: ${description}`)
}

async function findAction(interaction: ChatInputCommandInteraction) {
  const options = interaction.options
  const query = options.getString('query', true)

  const locations = await faunaClient.query(
    q.Map(q.Paginate(q.Match(q.Index('all_locations'))), q.Lambda('location', q.Get(q.Var('location')))),
  )

  const fuse = createFuse(locations as any)
  const results = fuse.search(query)

  if (results.length > 0) {
    const {
      data: { description, x, z },
    } = results[0].item
    await interaction.reply(`Closest match: ${description} (${x}, ${z})`)
  } else {
    await interaction.reply('No matching locations found.')
  }
}

type Command = 'register' | 'find'
