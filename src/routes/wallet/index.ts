import type { FastifyInstance } from 'fastify'

import { createWallet } from './create-wallet'
import { deleteWalletWithId } from './delete-wallet-with-id'
import { getWalletFromId } from './get-wallet-from-id'
import { getWallets } from './get-wallets'
import { updateWalletWithId } from './update-wallet-with-id'

export async function walletRoutes(app: FastifyInstance) {
  app.register(createWallet)
  app.register(getWalletFromId)
  app.register(getWallets)
  app.register(updateWalletWithId)
  app.register(deleteWalletWithId)
}
