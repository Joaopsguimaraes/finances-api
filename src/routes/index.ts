import type { FastifyInstance } from 'fastify'

import { authRoutes } from './auth'
import { categoryRoutes } from './category'
import { creditCartRoute } from './credit-card'
import { transactionRoute } from './transactions'
import { walletRoutes } from './wallet'

export async function appRoutes(app: FastifyInstance) {
  app.register(authRoutes)
  app.register(walletRoutes)
  app.register(categoryRoutes)
  app.register(creditCartRoute)
  app.register(transactionRoute)
}
