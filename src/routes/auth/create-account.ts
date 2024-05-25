import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/database/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        tags: ['auth'],
        summary: 'Create a new account',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
          avatarUrl: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { email, name, password, avatarUrl } = request.body

      const userWithSameEmail = await prisma.user.findFirst({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('User with same email already exists')
      }

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          avatarUrl,
        },
      })

      return reply.status(201).send()
    },
  )
}
