import { Client, IntentsBitField } from 'discord.js'

// Initialize discord bot
const client = new Client({ intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages] })

// When bot is ready
client.on("ready", () => {
  console.log('Bot is ready')
})

// When bot receives a message
client.on("messageCreate", message => {
  if (message.content === "!ping") {
    message.reply("Pong!")
  }
})
