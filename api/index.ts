import { ApolloServer } from 'apollo-server'
import { context } from './context'
import { schema } from './schema'

export const server = new ApolloServer({
  schema,
  context,
})

module.exports = (req: any, res: any) => {
  server.listen({ port: 8080 }).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })

  res.status(200).send(`Hello world!`)
}
