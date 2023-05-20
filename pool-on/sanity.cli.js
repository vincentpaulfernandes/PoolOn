import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7mvkx3am',
    dataset: 'production',
    "useCdn": false,
  "withCredentials": true,
  "token": "sanity-auth-token",
  "permissions": {
    "my-role": {
      "graphql": {
        "*": ["read", "create", "update", "delete"]
      }
    }
  }
  }
})
