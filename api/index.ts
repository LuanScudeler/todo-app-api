import * as dotenv from 'dotenv'
import { context } from './context'
import { schema } from './schema'
import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import http from 'http'
import express from 'express'
import session from 'express-session'
import cors from 'cors'

dotenv.config()

const app = express()

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    cookie: { secure: false, maxAge: 60000 },
    saveUninitialized: true,
    resave: true,
  })
)

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

const httpServer = http.createServer(app)

const startApolloServer = async (app: any, httpServer: any) => {
  const server = new ApolloServer({
    schema,
    context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({
    app,
    cors: corsOptions,
  })
}

startApolloServer(app, httpServer)

export default httpServer
