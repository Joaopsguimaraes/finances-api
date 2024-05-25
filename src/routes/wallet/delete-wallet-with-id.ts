import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { auth } from '../middlewares/auth'

export async function deleteWalletWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/wallet/:id',
      {
        schema: {
          tags: ['Wallet'],
          summary: 'Delete a wallet with ID',
          params: z.object({
            id: z.string(),
          }),
          response: {
            200: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const userId = await request.getCurrentUserId()

        await prisma.wallet.delete({
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send()
      },
    )
}
