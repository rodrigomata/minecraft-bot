import algolia from 'algoliasearch'

const { ALGOLIA_APP_ID = '', ALGOLIA_ADMIN_KEY = '', ALGOLIA_INDEX_NAME = '' } = process.env

const client = algolia(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY)
export const algoliaIndex = client.initIndex(ALGOLIA_INDEX_NAME)
