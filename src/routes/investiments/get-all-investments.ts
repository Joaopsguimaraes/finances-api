import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function getAllInvestments(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/investment',
      {
        schema: {
          tags: ['Investment'],
          summary: 'Get list of investments',
          response: {
            200: z.array(
              z.object({
                name: z.string(),
                type: z.union([
                  z.literal('STOCKS'),
                  z.literal('CRYPTO'),
                  z.literal('FUND'),
                  z.literal('OTHER'),
                ]),
                balance: z.number(),
                description: z.string().nullable(),
                date: z.date(),
                createdAt: z.date(),
                updatedAt: z.date(),
                userId: z.string(),
              }),
            ),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const investmentsFounded = await prisma.investment.findMany({
          where: {
            userId,
          },
        })

        return reply.status(200).send(investmentsFounded)
      },
    )
}
