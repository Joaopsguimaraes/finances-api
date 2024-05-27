import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getInvestmentFromId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/investment/:id',
      {
        schema: {
          tags: ['Investment'],
          summary: 'Get an investment from id',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
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
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const investmentFounded = await prisma.investment.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!investmentFounded) {
          throw new BadRequestError(`Investment not found`)
        }

        return reply.status(200).send(investmentFounded)
      },
    )
}
