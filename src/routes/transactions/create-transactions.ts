import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../middlewares/auth'

export async function createTransactions(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/transaction',
      {
        schema: {
          tags: ['Transactions'],
          summary: 'Create a transaction',
          body: z.object({
            amount: z.number(),
            type: z.union([
              z.literal('INCOME'),
              z.literal('EXPENSE'),
              z.literal('INVESTIMENT'),
            ]),
            description: z.string().nullable().optional(),
            date: z.date(),
            isRepet: z.boolean().default(false),
            repetTimes: z.number().optional(),
            categoryId: z.string(),
            walletId: z.string().optional().nullable(),
            creditCardId: z.string().optional().nullable(),
            investimentsId: z.string().optional().nullable(),
          }),
          response: {
            201: z.null(),
          },
        },
      },
      async (request, reply) => {
        const {
          categoryId,
          date,
          isRepet,
          creditCardId,
          description,
          investimentsId,
          repetTimes,
          walletId,
          amount,
          type,
        } = request.body
        const userId = await request.getCurrentUserId()

        if (walletId) {
          const walletFounded = await prisma.wallet.findUnique({
            where: {
              id: walletId,
              userId,
            },
          })

          if (!walletFounded) {
            throw new BadRequestError("Wallet doesn't exist")
          }
        }

        if (categoryId) {
          const categoryFounded = await prisma.category.findUnique({
            where: {
              id: categoryId,
              userId,
            },
          })

          if (!categoryFounded) {
            throw new BadRequestError("Category doesn't exist")
          }
        }

        if (creditCardId) {
          const creditCardFounded = await prisma.creditCard.findUnique({
            where: {
              id: creditCardId,
              userId,
            },
          })

          if (!creditCardFounded) {
            throw new BadRequestError("Credit card doesn't exist")
          }
        }

        if (investimentsId) {
          const investimentsFounded = await prisma.investiments.findUnique({
            where: {
              id: investimentsId,
              userId,
            },
          })

          if (!investimentsFounded) {
            throw new BadRequestError("Investiments doesn't exist")
          }
        }

        if (isRepet && !!repetTimes) {
          await prisma.transaction.createMany({
            data: Array.from({ length: repetTimes }).map((_, index) => ({
              amount,
              type,
              description: `${description} - ${index + 1}/${repetTimes}`,
              date: new Date(
                new Date(date).setMonth(new Date(date).getMonth() + index),
              ),
              isRepet,
              repetTimes,
              categoryId,
              walletId,
              creditCardId,
              investimentsId,
              userId,
            })),
          })
        }

        await prisma.transaction.create({
          data: {
            amount,
            type,
            description,
            date,
            isRepet,
            repetTimes,
            categoryId,
            walletId,
            creditCardId,
            investimentsId,
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
