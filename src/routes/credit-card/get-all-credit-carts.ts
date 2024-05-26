import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function getAllCreditCards(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/credit-card',
      {
        schema: {
          tags: ['Credit Card'],
          summary: 'Get a list of credit cards',
          response: {
            200: z.array(
              z.object({
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
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const allCreditCards = await prisma.creditCard.findMany({
          where: {
            userId,
          },
        })

        return reply.status(200).send(allCreditCards)
      },
    )
}
