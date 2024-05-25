import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function getWallets(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/wallet',
      {
        schema: {
          tags: ['Wallet'],
          summary: 'Get a list of wallets',
          response: {
            200: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                balance: z.number(),
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

        const wallets = await prisma.wallet.findMany({
          where: {
            userId,
          },
        })

        if (!wallets) {
          throw new BadRequestError('Wallet not found')
        }

        return reply.send(wallets)
      },
    )
}
