import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.$connect()

  const newTodo = await prisma.todos.create({
    data: {
      title: 'test',
    },
  })
  console.log(`created`, newTodo)

  const allTodos = await prisma.todos.findMany()
  console.log(allTodos)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
