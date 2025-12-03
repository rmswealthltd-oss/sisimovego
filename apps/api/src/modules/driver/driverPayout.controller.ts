import { Request, Response } from "express";
import { DriverPayoutService } from "./driverPayout.service";
import prisma from "../../db";

// Full AuthUser type
export type AuthUser = {
  id: string;
  email: string | null;
  role: "USER" | "DRIVER" | "ADMIN";
  firstName: string;
  middleName: string | null; // always explicitly null if missing
  lastName: string;
};

// Authenticated request type
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const DriverPayoutController = {
  /**
   * POST /drivers/payouts/request
   */
  async requestPayout(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    const { amountCents, description } = req.body;

    try {
      const result = await DriverPayoutService.payoutToDriver({
        userId: req.user.id,
        amountCents: Number(amountCents),
        description,
      });

      return res.json({ ok: true, payout: result });
    } catch (err: any) {
      console.error("DriverPayoutController.requestPayout error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /drivers/payouts/me
   */
  async myPayouts(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    try {
      const rows = await prisma.payout.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
      });

      return res.json({ ok: true, payouts: rows });
    } catch (err: any) {
      console.error("DriverPayoutController.myPayouts error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /admin/payouts
   */
  async listAll(_req: AuthRequest, res: Response) {
    try {
      const payouts = await prisma.payout.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.json({ ok: true, payouts });
    } catch (err: any) {
      console.error("DriverPayoutController.listAll error:", err);
      return res.status(500).json({ error: err.message });
    }
  },

  /**
   * GET /admin/payouts/:id
   */
  async getOne(req: AuthRequest, res: Response) {
    try {
      const payout = await prisma.payout.findUnique({
        where: { id: req.params.id },
      });
      if (!payout) return res.status(404).json({ error: "not_found" });

      return res.json({ ok: true, payout });
    } catch (err: any) {
      console.error("DriverPayoutController.getOne error:", err);
      return res.status(500).json({ error: err.message });
    }
  },
};
