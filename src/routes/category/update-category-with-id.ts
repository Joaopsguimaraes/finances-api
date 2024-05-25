import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function updateCategoryFromId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/category/:id',
      {
        schema: {
          tags: ['Category'],
          summary: 'Update a category with ID',
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z.string(),
            icon: z.string(),
          }),
          response: {
            200: z.object({
              categoryId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const { name, icon } = request.body
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

        await prisma.category.update({
          where: {
            id,
          },
          data: {
            name,
            icon,
          },
        })

        return reply.status(200).send({
          categoryId: category.id,
        })
      },
    )
}
