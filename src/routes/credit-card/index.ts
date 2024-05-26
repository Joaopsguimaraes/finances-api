import type { FastifyInstance } from 'fastify'

import { createCreditCard } from './create-new-credit-cart'
import { deleteCreditCardWithId } from './delete-credit-cart-with-id'
import { getAllCreditCards } from './get-all-credit-carts'
import { getCreditCardWithId } from './get-credit-cart-with-id'
import { updateCreditCardWithId } from './update-credit-cart-with-id'

export async function creditCartRoute(app: FastifyInstance) {
  app.register(createCreditCard)
  app.register(deleteCreditCardWithId)
  app.register(getAllCreditCards)
  app.register(getCreditCardWithId)
  app.register(updateCreditCardWithId)
}
