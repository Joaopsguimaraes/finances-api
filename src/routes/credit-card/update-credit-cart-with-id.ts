import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function updateCreditCartWithId(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/credit-cart/:id',
      {
        schema: {
          tags: ['Credit Cart'],
          summary: 'Update an credit cart with ID',
          params: z.object({
            id: z.string(),
          }),
          body: z.object({
            name: z.string(),
            ownerCurrentName: z.string(),
            number: z.string(),
            cvv: z.string(),
            expiration: z.string(),
          }),
          response: {
            200: z.object({
              creditCardId: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { id } = request.params
        const { name, ownerCurrentName, number, cvv, expiration } = request.body
        const userId = await request.getCurrentUserId()

        const creditCartFounded = await prisma.creditCart.findUnique({
          where: {
            id,
            userId,
          },
        })

        if (!creditCartFounded) {
          throw new BadRequestError('Credit Cart not found')
        }

        const creditCartEdited = await prisma.creditCart.update({
          data: {
            name,
            ownerCurrentName,
            number,
            cvv,
            expiration,
          },
          where: {
            id,
            userId,
          },
        })

        return reply.status(200).send({
          creditCardId: creditCartEdited.id,
        })
      },
    )
}
