// src/lib/escrow.ts


/**
 * Escrow helpers.
 * NOTE: prefer calling these inside a passed 'tx' transaction to guarantee atomicity.
 */

export async function ensureSystemEscrow(tx: any) {
  let escrow = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
  if (!escrow) {
    escrow = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
  }
  return escrow;
}

/**
 * Credit escrow and create ledger entry.
 */
export async function creditEscrow(tx: any, amountCents: number, description?: string) {
  const escrow = await ensureSystemEscrow(tx);
  await tx.wallet.update({
    where: { id: escrow.id },
    data: { balance: { increment: amountCents } }
  });
  return tx.ledger.create({
    data: {
      walletId: escrow.id,
      amount: amountCents,
      type: "BOOKING_PAYMENT",
      description
    }
  });
}

/**
 * Debit escrow (for payouts) and ledger entry.
 */
export async function debitEscrowForPayout(tx: any, amountCents: number, description?: string) {
  const escrow = await ensureSystemEscrow(tx);
  // Optional: check for sufficient balance first
  if ((escrow.balance ?? 0) < amountCents) {
    throw new Error("insufficient_escrow_balance");
  }
  await tx.wallet.update({
    where: { id: escrow.id },
    data: { balance: { decrement: amountCents } }
  });
  return tx.ledger.create({
    data: {
      walletId: escrow.id,
      amount: -amountCents,
      type: "DRIVER_PAYOUT",
      description
    }
  });
}
