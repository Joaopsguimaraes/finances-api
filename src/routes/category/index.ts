import type { FastifyInstance } from 'fastify'

import { createCategory } from './create-category'
import { getAllCategories } from './get-all-categories'
import { getCategoryFromId } from './get-category-from-id'
import { updateCategoryFromId } from './update-category-with-id'

export async function categoryRoutes(app: FastifyInstance) {
  app.register(createCategory)
  app.register(getAllCategories)
  app.register(getCategoryFromId)
  app.register(updateCategoryFromId)
}
