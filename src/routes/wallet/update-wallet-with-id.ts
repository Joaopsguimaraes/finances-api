import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function updateWalletWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/wallet/:id',
      {
        schema: {
          tags: ['Wallet'],
          summary: 'Update a wallet with ID',
          body: z.object({
            name: z.string(),
            balance: z.number(),
          }),
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, balance } = request.body
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        await prisma.wallet.update({
          data: {
            name,
            balance,
          },
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send()
      },
    )
}
