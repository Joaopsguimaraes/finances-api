import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getCreditCardWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/credit-card/:id',
      {
        schema: {
          tags: ['Credit Card'],
          summary: 'Get an credit card with ID',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              ownerCurrentName: z.string(),
              number: z.string(),
              cvv: z.string(),
              expiration: z.string(),
              userId: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
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

        return reply.status(200).send(creditCardFounded)
      },
    )
}
