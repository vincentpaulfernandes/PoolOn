import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: '7mvkx3am',
  dataset: 'production',
  apiVersion: 'v1',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})
