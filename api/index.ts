import { context } from './context'
import { schema } from './schema'
import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const httpServer = http.createServer(app)
const startApolloServer = async (app: any, httpServer: any) => {
  const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })
}

startApolloServer(app, httpServer)

export default httpServer
