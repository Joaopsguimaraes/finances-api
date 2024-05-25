import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getWalletFromId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet/:id',
      {
        schema: {
          tags: ['Wallet'],
          summary: 'Get a wallet with ID',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.object({
              id: z.string(),
              name: z.string(),
              balance: z.number(),
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

        const wallet = await prisma.wallet.findUnique({
          where: {
            id,
            userId,
          },
          include: {
            transaction: true,
          },
        })

        if (!wallet) {
          throw new BadRequestError('Wallet not found')
        }

        return reply.send({
          balance: wallet.balance,
          createdAt: wallet.createdAt,
          id: wallet.id,
          name: wallet.name,
          updatedAt: wallet.updatedAt,
          userId: wallet.userId,
        })
      },
    )
}
