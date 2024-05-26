import type { FastifyInstance } from 'fastify'

import { createTransactions } from './create-transactions'

export async function transactionRoute(app: FastifyInstance) {
  app.register(createTransactions)
}
