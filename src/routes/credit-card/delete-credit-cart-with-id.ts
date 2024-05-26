import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function deleteCreditCardWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/credit-card/:id',
      {
        schema: {
          tags: ['Credit Card'],
          summary: 'Delete an credit card with ID',
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

        const creditCardFounded = await prisma.creditCard.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!creditCardFounded) {
          throw new BadRequestError('Credit Cart not found')
        }

        await prisma.creditCard.delete({
          where: {
            id,
          },
        })

        return reply.status(200).send()
      },
    )
}
