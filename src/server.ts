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
import { authRoutes } from './routes/auth'
import { categoryRoutes } from './routes/category'
import { creditCartRoute } from './routes/credit-card'
import { walletRoutes } from './routes/wallet'

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

app.register(authRoutes)
app.register(walletRoutes)
app.register(categoryRoutes)
app.register(creditCartRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('Server is running on port 3333')
})
