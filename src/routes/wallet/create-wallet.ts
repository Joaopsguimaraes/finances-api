import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function createWallet(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/wallet',
      {
        schema: {
          tags: ['auth'],
          summary: 'Create wallet',
          body: z.object({
            name: z.string(),
            balance: z.number(),
          }),
          response: {
            201: z.object({
              walletId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { balance, name } = request.body
        const userId = await request.getCurrentUserId()

        const wallet = await prisma.wallet.create({
          data: {
            name,
            balance,
            userId,
          },
        })

        return reply.send({ walletId: wallet.id })
      },
    )
}
