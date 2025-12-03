// src/modules/wallet/wallet.controller.ts
import { Response } from "express";
import prisma, { UserRole, WalletType } from "../../db"; // ✅ import WalletType here
import { AuthRequest } from "../../middleware/requireAuth";

export const WalletController = {
  async getMyWallet(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== UserRole.DRIVER)
      return res.status(403).json({ message: "Only drivers have wallets" });

    const wallet = await prisma.wallet.findUnique({
      where: {
        ownerId_type: {
          ownerId: req.user.id,
          type: WalletType.DRIVER, // ✅ use imported WalletType
        },
      },
      select: {
        id: true,
        balance: true,
        currency: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    return res.json({
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
    });
  },

  async addFunds(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== UserRole.DRIVER)
      return res.status(403).json({ message: "Only drivers can add funds" });

    const { amountCents } = req.body;
    if (!amountCents || typeof amountCents !== "number" || amountCents <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const wallet = await prisma.wallet.update({
      where: {
        ownerId_type: {
          ownerId: req.user.id,
          type: WalletType.DRIVER,
        },
      },
      data: {
        balance: { increment: amountCents },
      },
      select: {
        id: true,
        balance: true,
        currency: true,
      },
    });

    return res.json({
      id: wallet.id,
      balance: wallet.balance,
      currency: wallet.currency,
    });
  },
};
