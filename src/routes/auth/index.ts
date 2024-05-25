import type { FastifyInstance } from 'fastify'

import { authenticateWithPassword } from './authenticate-with-password'
import { createAccount } from './create-account'
import { getAuthToken } from './get-auth-token'
import { getProfile } from './get-profile'
import { requestPasswordRecover } from './request-password-recovery'
import { resetPassword } from './reset-password'

export async function authRoutes(app: FastifyInstance) {
  app.register(createAccount)
  app.register(getProfile)
  app.register(authenticateWithPassword)
  app.register(requestPasswordRecover)
  app.register(resetPassword)
  app.register(getAuthToken)
}
