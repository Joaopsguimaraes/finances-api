import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function updateCreditCardWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/credit-card/:id',
      {
        schema: {
          tags: ['Credit Card'],
          summary: 'Update an credit card with ID',
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z.string(),
            ownerCurrentName: z.string(),
            number: z.string(),
            cvv: z.string(),
            expiration: z.string(),
          }),
          response: {
            200: z.object({
              creditCardId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const { name, ownerCurrentName, number, cvv, expiration } = request.body
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

        const creditCardEdited = await prisma.creditCard.update({
          data: {
            name,
            ownerCurrentName,
            number,
            cvv,
            expiration,
          },
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send({
          creditCardId: creditCardEdited.id,
        })
      },
    )
}
