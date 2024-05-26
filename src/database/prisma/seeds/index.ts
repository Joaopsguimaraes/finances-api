import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  const passwordHash = await hash('123456', 6)
  const cvvHashed = await hash('111-111', 6)

  const user = await prisma.user.create({
    data: {
      name: 'Joao Guimaraes',
      email: 'joaoguimaraes@acme.com',
      passwordHash,
      avatarUrl: 'https://github.com/Joaopsguimaraes.png',
    },
  })

  const bankInterWallet = await prisma.wallet.create({
    data: {
      name: 'Banco inter',
      balance: 0,
      userId: user.id,
    },
  })

  const interInvestmentsWallet = await prisma.wallet.create({
    data: {
      name: 'Carteira Inter',
      balance: 2000,
      userId: user.id,
    },
  })

  const subscriptionsCategory = await prisma.category.create({
    data: {
      icon: 'monitor-icon',
      name: 'Assinaturas',
      userId: user.id,
    },
  })

  const housingCategory = await prisma.category.create({
    data: {
      icon: 'house-icon',
      name: 'Moradia',
      userId: user.id,
    },
  })

  const paymentsCategory = await prisma.category.create({
    data: {
      icon: 'currency-icon',
      name: 'Salario',
      userId: user.id,
    },
  })

  const investmentsCategory = await prisma.category.create({
    data: {
      icon: 'chart-icon',
      name: 'Investimentos',
      userId: user.id,
    },
  })

  const interCreditCard = await prisma.creditCard.create({
    data: {
      name: 'Cartão Inter João',
      ownerCurrentName: 'JOAO S GUIMARAES',
      number: '111-111-111-111',
      cvv: cvvHashed,
      expiration: '25-05-2030',
      userId: user.id,
    },
  })

  await prisma.transaction.createMany({
    data: [
      {
        type: 'INCOME',
        amount: 5000,
        description: 'Salario como programador',
        date: new Date(),
        userId: user.id,
        categoryId: paymentsCategory.id,
        walletId: bankInterWallet.id,
      },
      {
        type: 'EXPENSE',
        amount: 1700,
        description: 'Pagamento do aluguel',
        date: new Date(),
        userId: user.id,
        categoryId: housingCategory.id,
        walletId: bankInterWallet.id,
      },
      {
        type: 'EXPENSE',
        amount: 19.9,
        description: 'Assinatura Amazon',
        date: new Date(),
        userId: user.id,
        categoryId: subscriptionsCategory.id,
        creditCardId: interCreditCard.id,
      },
    ],
  })

  const investmentsLCA = await prisma.investiments.create({
    data: {
      type: 'FUND',
      name: 'Investimento em LCA 2024',
      balance: 0,
      date: new Date(),
      userId: user.id,
    },
  })

  await prisma.transaction.create({
    data: {
      type: 'INVESTIMENT',
      amount: 1000,
      description: 'Investimento em LCA',
      date: new Date(),
      userId: user.id,
      categoryId: investmentsCategory.id,
      walletId: interInvestmentsWallet.id,
      investimentsId: investmentsLCA.id,
    },
  })
}

seed().then(() => {
  console.log('Seeding complete')
})
