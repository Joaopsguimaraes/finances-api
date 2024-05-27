import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getTransactionsFromId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/transaction/:id',
      {
        schema: {
          tags: ['Transaction'],
          summary: 'Get a transaction from id',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              amount: z.number(),
              type: z.union([
                z.literal('INCOME'),
                z.literal('EXPENSE'),
                z.literal('INVESTMENT'),
              ]),
              description: z.string().nullable().optional(),
              date: z.date(),
              isRepeat: z.boolean().default(false),
              repeatTimes: z.number().optional().nullable(),
              categoryId: z.string().optional().nullable(),
              walletId: z.string().optional().nullable(),
              creditCardId: z.string().optional().nullable(),
              investmentsId: z.string().optional().nullable(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        const transactionFounded = await prisma.transaction.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!transactionFounded) {
          throw new BadRequestError('Transaction not found')
        }

        return reply.status(200).send(transactionFounded)
      },
    )
}
