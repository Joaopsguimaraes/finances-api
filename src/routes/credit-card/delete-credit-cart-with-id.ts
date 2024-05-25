import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function deleteCreditCartWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/credit-cart/:id',
      {
        schema: {
          tags: ['Credit Cart'],
          summary: 'Delete an credit cart with ID',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const creditCartFounded = await prisma.creditCart.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!creditCartFounded) {
          throw new BadRequestError('Credit Cart not found')
        }

        await prisma.creditCart.delete({
          where: {
            id,
          },
        })

        return reply.status(200).send()
      },
    )
}
