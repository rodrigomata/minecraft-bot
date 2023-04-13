import { Client as FaunaClient } from 'faunadb'

const { FAUNA_DB_KEY = '' } = process.env

const client = new FaunaClient({ secret: FAUNA_DB_KEY })

export default client
