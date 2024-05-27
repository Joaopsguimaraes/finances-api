import type { FastifyInstance } from 'fastify'

import { createInvestment } from './create-investment'
import { deleteInvestmentById } from './delete-investment-by-id'
import { getAllInvestments } from './get-all-investments'
import { getInvestmentFromId } from './get-investment-from-id'
import { updateInvestmentFromId } from './update-investment-from-id'

export async function investmentsRoutes(app: FastifyInstance) {
  app.register(createInvestment)
  app.register(getInvestmentFromId)
  app.register(getAllInvestments)
  app.register(updateInvestmentFromId)
  app.register(deleteInvestmentById)
}
