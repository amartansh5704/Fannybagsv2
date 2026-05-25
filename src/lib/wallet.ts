/**
 * src/lib/wallet.ts
 *
 * All functions accept an optional Prisma transaction client (`tx`).
 * When `tx` is provided, they run inside the caller's transaction (composable).
 * When `tx` is omitted, they open their own transaction (standalone use).
 *
 * This is the correct pattern for escrow — all money movement in one atomic unit.
 */

import { prisma } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

type TxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

// ─── Get or create wallet ─────────────────────────────────────────────────────
export async function getOrCreateWallet(userId: string, tx?: TxClient) {
  const db = tx ?? prisma
  return db.wallet.upsert({
    where:  { userId },
    update: {},
    create: { userId },
  })
}

// ─── Credit wallet ────────────────────────────────────────────────────────────
// Adds money. Pass tx to compose inside a larger transaction.
export async function creditWallet(
  userId: string,
  amount: number,
  type: string,
  description?: string,
  referenceId?: string,
  referenceType?: string,
  tx?: TxClient
) {
  if (amount <= 0) throw new Error('Credit amount must be positive')

  const run = async (db: TxClient) => {
    const wallet = await getOrCreateWallet(userId, db)

    const isDeposit = type === 'deposit'

    await db.wallet.update({
      where: { id: wallet.id },
      data: {
        balance:        { increment: amount },
        totalDeposited: isDeposit ? { increment: amount } : undefined,
        totalReceived:  !isDeposit ? { increment: amount } : undefined,
        updatedAt:      new Date(),
      },
    })

    await db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type,
        amount,
        description,
        referenceId,
        referenceType,
      },
    })
  }

  if (tx) {
    await run(tx)
  } else {
    await prisma.$transaction(async (innerTx) => run(innerTx as TxClient))
  }
}

// ─── Debit wallet ─────────────────────────────────────────────────────────────
// Removes money. Throws INSUFFICIENT_FUNDS if balance too low.
// Pass tx to compose inside a larger transaction.
export async function debitWallet(
  userId: string,
  amount: number,
  type: string,
  description?: string,
  referenceId?: string,
  referenceType?: string,
  tx?: TxClient
) {
  if (amount <= 0) throw new Error('Debit amount must be positive')

  const run = async (db: TxClient) => {
    const wallet = await getOrCreateWallet(userId, db)

    if (wallet.balance < amount) {
      throw new Error('INSUFFICIENT_FUNDS')
    }

    await db.wallet.update({
      where: { id: wallet.id },
      data: {
        balance:    { decrement: amount },
        totalSpent: { increment: amount },
        updatedAt:  new Date(),
      },
    })

    await db.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type,
        amount,
        description,
        referenceId,
        referenceType,
      },
    })
  }

  if (tx) {
    await run(tx)
  } else {
    await prisma.$transaction(async (innerTx) => run(innerTx as TxClient))
  }
}

// ─── Deposit (convenience wrapper) ───────────────────────────────────────────
export async function depositWallet(userId: string, amount: number) {
  return creditWallet(userId, amount, 'deposit', 'Wallet deposit')
}

// ─── Get admin user ID ────────────────────────────────────────────────────────
export async function getAdminUserId(tx?: TxClient): Promise<string> {
  const db = tx ?? prisma
  const admin = await db.user.findFirst({ where: { role: 'admin' } })
  if (!admin) throw new Error('ADMIN_NOT_FOUND')
  return admin.id
}