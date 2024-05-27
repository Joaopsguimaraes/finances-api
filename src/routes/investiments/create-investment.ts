import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function createInvestment(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/investment',
      {
        schema: {
          tags: ['Investment'],
          summary: 'Create an investment',
          body: z.object({
            name: z.string(),
            type: z.union([
              z.literal('STOCKS'),
              z.literal('CRYPTO'),
              z.literal('FUND'),
              z.literal('OTHER'),
            ]),
            balance: z.number(),
            description: z.string().optional(),
            date: z.date(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { name, balance, date, type, description } = request.body
        const userId = await request.getCurrentUserId()

        const investmentFounded = await prisma.investment.findUnique({
          where: {
            name,
            userId,
          },
        })

        if (investmentFounded) {
          throw new BadRequestError(`Investment ${name} already exists`)
        }

        await prisma.investment.create({
          data: {
            name,
            balance,
            date,
            type,
            description,
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
