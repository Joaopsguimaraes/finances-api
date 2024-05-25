import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getCategoryFromId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/category/:id',
      {
        schema: {
          tags: ['Category'],
          summary: 'Get a category with ID',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              icon: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const category = await prisma.category.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!category) {
          throw new BadRequestError('Category not found')
        }

        return reply.status(200).send(category)
      },
    )
}
