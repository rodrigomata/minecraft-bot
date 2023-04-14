import { APIGatewayProxyEvent } from 'aws-lambda'
import nacl from 'tweetnacl'

const { DISCORD_BOT_PUBLIC_KEY = '' } = process.env

export const verifyDiscordEvent = (event: APIGatewayProxyEvent) => {
  const signature = event.headers['X-Signature-Ed25519']
  const timestamp = event.headers['X-Signature-Timestamp']
  const body = event.body

  return nacl.sign.detached.verify(
    Buffer.from(`${timestamp}${body}`),
    Buffer.from(signature as string, 'hex'),
    Buffer.from(DISCORD_BOT_PUBLIC_KEY, 'hex'),
  )
}
