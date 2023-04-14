import { REST } from '@discordjs/rest'
import { Routes, APIApplicationCommand } from 'discord-api-types/v9'
import { SlashCommandBuilder } from '@discordjs/builders'
import * as fs from 'fs'

const { DISCORD_BOT_TOKEN = '', DISCORD_BOT_CLIENT_ID = '', GUILD_ID = '' } = process.env

// :: Load the commands from the commands.json file
const commandsData = JSON.parse(fs.readFileSync('./interactions.json', 'utf8'))

// :: Convert the commands data to Discord API format
const commands = commandsData.map((commandData: APIApplicationCommand) => {
  const command = new SlashCommandBuilder()
    .setName(commandData.name)
    .setDescription(commandData.description)

  commandData.options?.forEach(option => {
    switch (option.type) {
      case 3: // String
        command.addStringOption(opt =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required as boolean),
        )
        break
      case 4: // Integer
        command.addIntegerOption(opt =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required as boolean),
        )
        break
      case 10: // Number (float)
        command.addNumberOption(opt =>
          opt
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required as boolean),
        )
        break
      default:
        console.error(`Unsupported option type: ${option.type}`)
        break
    }
  })

  return command.toJSON()
})

// :: Set up the Discord REST client
const rest = new REST({ version: '9' }).setToken(DISCORD_BOT_TOKEN)

;(async () => {
  try {
    console.log('Started refreshing application (/) commands.')
    await rest.put(Routes.applicationGuildCommands(DISCORD_BOT_CLIENT_ID, GUILD_ID), {
      body: commands,
    })
    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()
