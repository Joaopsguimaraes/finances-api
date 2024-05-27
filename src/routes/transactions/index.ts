import type { FastifyInstance } from 'fastify'

import { createTransactions } from './create-transactions'
import { getTransactionsFromId } from './get-transaction-from-id'

export async function transactionRoute(app: FastifyInstance) {
  app.register(createTransactions)
  app.register(getTransactionsFromId)
}
