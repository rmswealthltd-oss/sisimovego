// src/modules/payments/escrow.service.ts
import prisma from "../../db";

export async function getSystemEscrowWallet(tx: any) {
  // system wallet has ownerId = null and type = ESCROW
  let wallet = await tx.wallet.findFirst({ where: { ownerId: null, type: "ESCROW" } });
  if (!wallet) {
    wallet = await tx.wallet.create({ data: { ownerId: null, type: "ESCROW", balance: 0 } });
  }
  return wallet;
}
