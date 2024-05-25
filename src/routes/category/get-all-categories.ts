import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function getAllCategories(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get a list of categories',
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                icon: z.string(),
                createdAt: z.date(),
                updatedAt: z.date(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const categories = await prisma.category.findMany({
          where: {
            userId,
          },
        })

        return reply.status(200).send(categories)
      },
    )
}
