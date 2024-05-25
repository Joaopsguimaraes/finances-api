import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './routes/_errors/error-handler'
import { authenticateWithPassword } from './routes/auth/authenticate-with-password'
import { createAccount } from './routes/auth/create-account'
import { getAuthToken } from './routes/auth/get-auth-token'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecover } from './routes/auth/request-password-recovery'
import { resetPassword } from './routes/auth/reset-password'
import { createWallet } from './routes/wallet/create-wallet'
import { getWalletFromId } from './routes/wallet/get-wallet-from-id'
import { getWallets } from './routes/wallet/get-wallets'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors)
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Finances API',
      description:
        'API to manage finances, including users, transactions, and categories.',
      version: '1.0.0',
    },
    servers: [],
  },
  transform: jsonSchemaTransform,
})

app.register(fastifyJwt, {
  secret: 'my-jwt-secret',
})

app.setErrorHandler(errorHandler)

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createAccount)
app.register(getProfile)
app.register(authenticateWithPassword)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(createWallet)
app.register(getWalletFromId)
app.register(getWallets)
app.register(getAuthToken)

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on port 3333')
})
