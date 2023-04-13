import { Client, IntentsBitField } from 'discord.js'

const { DISCORD_BOT_TOKEN = '', GUILD_ID = '' } = process.env

export default class DiscordClient {
  private client: Client

  constructor() {
    this.client = new Client({
      intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
    })
  }

  public async registerCommands() {
    this.client.once('ready', async () => {
      console.log('Bot is ready')

      await this.client.guilds.cache.get(GUILD_ID)?.commands.set([
        {
          name: 'register',
          description: 'Register a new location',
          options: [
            {
              name: 'x',
              type: 4,
              description: 'X coordinate of the location',
              required: true,
            },
            {
              name: 'z',
              type: 4,
              description: 'Z coordinate of the location',
              required: true,
            },
            {
              name: 'description',
              type: 3,
              description: 'Description of the location',
              required: true,
            },
          ],
        },
        {
          name: 'find',
          description: 'Find a location based on a search query',
          options: [
            {
              name: 'query',
              type: 3,
              description: 'The search query',
              required: true,
            },
          ],
        },
      ])
    })
  }

  public getClient() {
    return this.client
  }

  public loginClient() {
    this.client.login(DISCORD_BOT_TOKEN)
  }
}
