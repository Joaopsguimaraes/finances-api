import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function deleteInvestmentById(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/investment/:id',
      {
        schema: {
          tags: ['Investment'],
          summary: 'Delete an investment from id',
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

        const investmentFounded = await prisma.investment.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!investmentFounded) {
          throw new BadRequestError(`Investment not found`)
        }

        await prisma.investment.delete({
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send()
      },
    )
}
