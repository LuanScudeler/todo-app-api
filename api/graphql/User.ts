import { objectType } from 'nexus'

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.string('id')
    t.nonNull.string('name')
    t.nonNull.string('email')
    t.nonNull.list.nonNull.field('todos', {
      type: 'Todo',
      resolve(parent, _, context) {
        return context.prisma.users
          .findUnique({ where: { id: parent.id } })
          .todos()
      },
    })
  },
})
