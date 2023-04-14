import { APIGatewayProxyEvent } from 'aws-lambda'
import nacl from 'tweetnacl'

const { DISCORD_BOT_PUBLIC_KEY = '' } = process.env

export const verifyDiscordEvent = (event: APIGatewayProxyEvent) => {
  const signature = event.headers['x-signature-ed25519']
  const timestamp = event.headers['x-signature-timestamp']
  const body = event.body

  return nacl.sign.detached.verify(
    Buffer.from((timestamp as string) + body),
    Buffer.from(signature as string, 'hex'),
    Buffer.from(DISCORD_BOT_PUBLIC_KEY, 'hex'),
  )
}
