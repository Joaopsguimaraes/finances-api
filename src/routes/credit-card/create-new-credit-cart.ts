import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function createCreditCart(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/credit-cart',
      {
        schema: {
          tags: ['Credit Cart'],
          summary: 'Create an credit cart',
          body: z.object({
            name: z.string(),
            ownerCurrentName: z.string(),
            number: z.string(),
            cvv: z.string(),
            expiration: z.string(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, ownerCurrentName, number, cvv, expiration } = request.body
        const userId = await request.getCurrentUserId()

        const creditCardFounded = await prisma.creditCart.findUnique({
          where: {
            number,
            userId,
          },
        })

        if (creditCardFounded) {
          throw new BadRequestError('Credit Card already exists')
        }

        await prisma.creditCart.create({
          data: {
            name,
            ownerCurrentName,
            number,
            cvv,
            expiration,
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
