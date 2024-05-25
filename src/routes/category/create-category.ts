import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function createCategory(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/category',
      {
        schema: {
          tags: ['Category'],
          summary: 'Create a category',
          body: z.object({
            name: z.string(),
            icon: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, icon } = request.body
        const userId = await request.getCurrentUserId()

        const category = await prisma.category.findUnique({
          where: {
            name,
            userId,
          },
        })

        if (category) {
          throw new BadRequestError('Category already exists')
        }

        await prisma.category.create({
          data: {
            name,
            icon,
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
