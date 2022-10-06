import { extendType, nonNull, objectType, stringArg } from 'nexus'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.field('user', {
      type: 'User',
    })
  },
})

export const AuthQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('isAuthenticated', {
      type: 'Boolean',
      resolve(_, __, context) {
        const { req } = context

        if (req.session.userId) {
          return true
        }

        return false
      },
    })
  },
})

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('login', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      async resolve(_, args, context) {
        const { prisma, req } = context
        const user = await prisma.users.findUnique({
          where: { email: args.email },
        })

        if (!user) {
          throw new Error('No such user found')
        }

        const valid = await bcrypt.compare(args.password, user.password)
        if (!valid) {
          throw new Error('Invalid password')
        }

        req.session.userId = user.id
        await new Promise((resolve) => {
          req.session.save(function (err: any) {
            if (err) throw new Error('Session error')

            resolve(true)
          })
        })

        const token = jwt.sign(
          { userId: user.id },
          process.env.APP_SECRET as string
        )

        return {
          user,
        }
      },
    })
    t.nonNull.field('logout', {
      type: 'Boolean',
      async resolve(_, __, context) {
        const { req } = context

        req.session.userId = undefined
        await new Promise((resolve) => {
          req.session.save(function (err: any) {
            if (err) throw new Error('Session error')

            resolve(true)
          })
        })

        return true
      },
    })
    t.nonNull.field('signup', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(_, args, context) {
        const { email, name } = args

        const password = await bcrypt.hash(args.password, 10)

        const user = await context.prisma.users.create({
          data: { email, name, password },
        })

        const token = jwt.sign(
          { userId: user.id },
          process.env.APP_SECRET as string
        )

        return {
          token,
          user,
        }
      },
    })
  },
})
