import { ApolloServer } from 'apollo-server'
import { context } from './context'
import { schema } from './schema'

export const server = new ApolloServer({
  schema,
  context,
})

module.exports = (req: any, res: any) => {
  server.start().then(() => console.log('Server started'))

  res.status(200).send(`Hello world!`)
}
