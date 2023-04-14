import { APIGatewayProxyEvent, Context } from 'aws-lambda'
import { APIApplicationCommand } from 'discord-api-types/v9'
import middy from '@middy/core'
import errorLogger from '@middy/error-logger'

import { verifyDiscordEvent } from './plugins/discord'
import { algoliaIndex } from './plugins/algolia'

const lambdaHandler = async (event: APIGatewayProxyEvent, _context: Context) => {
  const isValid = verifyDiscordEvent(event)
  const body = JSON.parse(event.body || '{}')

  // :: For invalid requests
  if (!isValid) return { statusCode: 401, body: 'Unauthorized' }

  // :: For ping event
  if (body.type === 1) return { statusCode: 200, body: JSON.stringify({ type: 1 }) }

  const interaction = body.data.name as Interaction
  const data: APIApplicationCommand = body.data

  switch (interaction) {
    case 'register': {
      const item = {
        objectID: new Date().getTime().toString(),
        description: findValue(data, 'description'),
        x: findValue(data, 'x'),
        z: findValue(data, 'Z'),
      }
      await algoliaIndex.saveObject(item)
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 4, data: { content: 'Registered!' } }),
      }
    }
    case 'find': {
      const query = findValue(data, 'query')
      const results = await algoliaIndex.search(query)
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 4, data: { content: JSON.stringify(results) } }),
      }
    }
    default:
      return { statusCode: 400, body: 'Bad Request' }
  }
}

const handler = middy().use(errorLogger()).handler(lambdaHandler)
export default handler

function findValue(data: APIApplicationCommand, value: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data.options?.find(option => option.name === value) as any)?.value
}

type Interaction = 'register' | 'find'
