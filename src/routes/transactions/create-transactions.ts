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
          tags: ['Transaction'],
          summary: 'Create a transaction',
          body: z.object({
            amount: z.number(),
            type: z.union([
              z.literal('INCOME'),
              z.literal('EXPENSE'),
              z.literal('INVESTMENT'),
            ]),
            description: z.string().nullable().optional(),
            date: z.date(),
            isRepeat: z.boolean().default(false),
            repeatTimes: z.number().optional(),
            categoryId: z.string(),
            walletId: z.string().optional().nullable(),
            creditCardId: z.string().optional().nullable(),
            investmentsId: z.string().optional().nullable(),
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
          isRepeat,
          creditCardId,
          description,
          investmentsId,
          repeatTimes,
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

        if (investmentsId) {
          const investmentsFounded = await prisma.investment.findUnique({
            where: {
              id: investmentsId,
              userId,
            },
          })

          if (!investmentsFounded) {
            throw new BadRequestError("Investments doesn't exist")
          }
        }

        if (isRepeat && !!repeatTimes) {
          await prisma.transaction.createMany({
            data: Array.from({ length: repeatTimes }).map((_, index) => ({
              amount,
              type,
              description: `${description} - ${index + 1}/${repeatTimes}`,
              date: new Date(
                new Date(date).setMonth(new Date(date).getMonth() + index),
              ),
              isRepeat,
              repeatTimes,
              categoryId,
              walletId,
              creditCardId,
              investmentsId,
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
            isRepeat,
            repeatTimes,
            categoryId,
            walletId,
            creditCardId,
            investmentsId,
            userId,
          },
        })

        return reply.status(201).send()
      },
    )
}
