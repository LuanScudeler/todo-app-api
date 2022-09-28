import { ObjectId } from 'bson'
import { extendType, idArg, nonNull, objectType, stringArg } from 'nexus'

export const Todo = objectType({
  name: 'Todo',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('title')
    t.nonNull.dateTime('createdAt')
    t.field('createdBy', {
      type: 'User',
      resolve(parent, _, context) {
        return context.prisma.todos
          .findUnique({ where: { id: parent.id } })
          .createdBy()
      },
    })
  },
})

export const TodoQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('todos', {
      type: 'Todo',
      resolve(_, __, context) {
        return context.prisma.todos.findMany()
      },
    })
  },
})

export const TodoMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('post', {
      type: 'Todo',
      args: {
        title: nonNull(stringArg()),
      },
      resolve(_, args, context) {
        const { title } = args
        const { userId } = context

        if (!userId) {
          throw new Error('Cannot post without logging in.')
        }

        const newTodo = context.prisma.todos.create({
          data: {
            title,
            createdBy: { connect: { id: userId } },
          },
        })

        return newTodo
      },
    })
    t.nonNull.field('update', {
      type: 'Todo',
      args: {
        id: nonNull(idArg()),
        title: nonNull(stringArg()),
      },
      resolve(_, args, context) {
        const { id, title } = args

        const updatedTodo = context.prisma.todos.update({
          where: {
            id,
          },
          data: {
            title,
          },
        })

        return updatedTodo
      },
    })
    t.nonNull.field('delete', {
      type: 'Todo',
      args: {
        id: nonNull(idArg()),
      },
      resolve(_, args, context) {
        const { id } = args
        const deleteTodo = context.prisma.todos.delete({
          where: {
            id,
          },
        })

        return deleteTodo
      },
    })
  },
})
