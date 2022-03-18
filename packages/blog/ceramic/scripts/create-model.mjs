import 'dotenv/config'
import { writeFile } from 'node:fs/promises'
import { CeramicClient } from '@ceramicnetwork/http-client'
import { model as profileModel } from '@datamodels/identity-profile-basic'
import { ModelManager } from '@glazed/devtools'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays'

if (!process.env.CERAMIC_SEED) {
  throw new Error('Missing SEED environment variable')
}

const CERAMIC_URL = process.env.CERAMIC_URL || 'https://ceramic-clay.3boxlabs.com'

// The seed must be provided as an environment variable
const seed = fromString(process.env.CERAMIC_SEED, 'base16')
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(seed),
  resolver: getResolver(),
})
await did.authenticate()

// Connect to the Ceramic node
const ceramic = new CeramicClient(CERAMIC_URL)
ceramic.did = did

// Create a manager for the model
const manager = new ModelManager(ceramic)

// Add basicProfile to the model
manager.addJSONModel(profileModel)


// Create the schemas
const blogPostSchemaID = await manager.createSchema('BlogPost', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'BlogPost',
  type: 'object',
  properties: {
    date: {
      type: 'string',
      format: 'date-time',
      title: 'date',
      maxLength: 30,
    },
    text: {
      type: 'string',
      title: 'text',
      maxLength: 4000,
    },
  },
})
const blogPostsSchemaID = await manager.createSchema('BlogPosts', {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'BlogPostsList',
  type: 'object',
  properties: {
    blogPosts: {
      type: 'array',
      title: 'blogPosts',
      items: {
        type: 'object',
        title: 'BlogPostItem',
        properties: {
          id: {
            $comment: `cip88:ref:${manager.getSchemaURL(blogPostSchemaID)}`,
            type: 'string',
            pattern: '^ceramic://.+(\\?version=.+)?',
            maxLength: 150,
          },
          title: {
            type: 'string',
            title: 'title',
            maxLength: 100,
          },
        },
      },
    },
  },
})

// Create the definition using the created schema ID
await manager.createDefinition('blogPosts', {
  name: 'blogPosts',
  description: 'Simple text notes',
  schema: manager.getSchemaURL(blogPostsSchemaID),
})

await manager.createTile(
  'placeholderBlogPost',
  { text: 'This is a placeholder for the blog post contents...' },
  { schema: manager.getSchemaURL(blogPostSchemaID) }
)

// Write model to JSON file
await writeFile(new URL('./model.json', import.meta.url), JSON.stringify(manager.toJSON()))
console.log('Encoded model written to scripts/model.json file')
