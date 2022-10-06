import { PrismaClient } from '@prisma/client'
import { decodeAuthHeader, AuthTokenPayload } from './utils/auth'
import { Request } from 'express'

export const prisma = new PrismaClient()

type RequestWithSession = Request & {
  session: {
    userId?: string
    save: any
  }
}
export interface Context {
  prisma: PrismaClient
  userId?: string
  req: RequestWithSession
}

export const context = ({ req }: { req: RequestWithSession }): Context => {
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null

  return {
    prisma,
    req,
    userId: req.session.userId,
  }
}
