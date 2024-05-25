import type { FastifyInstance } from 'fastify'

import { createCreditCart } from './create-new-credit-cart'
import { deleteCreditCartWithId } from './delete-credit-cart-with-id'
import { getAllCreditCarts } from './get-all-credit-carts'
import { getCreditCartWithId } from './get-credit-cart-with-id'
import { updateCreditCartWithId } from './update-credit-cart-with-id'

export async function creditCartRoute(app: FastifyInstance) {
  app.register(createCreditCart)
  app.register(deleteCreditCartWithId)
  app.register(getAllCreditCarts)
  app.register(getCreditCartWithId)
  app.register(updateCreditCartWithId)
}
