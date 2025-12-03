import { Request, Response } from "express";
import { DriverService } from "./driver.service";
import prisma from "../../db";

// Full AuthUser type
export type AuthUser = {
  id: string;
  email: string | null;
  role: "USER" | "DRIVER" | "ADMIN";
  firstName: string;
  middleName: string | null; // explicitly null if missing
  lastName: string;
};

// Authenticated request
export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const DriverController = {
  /**
   * GET /drivers/me
   */
  async me(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ error: "unauthorized" });

    const driver = await DriverService.getDriver(req.user.id);
    return res.json({ driver });
  },

  /**
   * POST /drivers/verify-license (admin or automated)
   */
  async verifyLicense(req: AuthRequest, res: Response) {
    const { userId } = req.body;

    const result = await DriverService.verifyDriverLicense(userId);
    return res.json({ ok: true, driver: result });
  },

  /**
   * POST /drivers/approve
   * Admin manually verifies driver
   */
  async adminVerify(req: AuthRequest, res: Response) {
    if (!req.user || req.user.role !== "ADMIN")
      return res.status(403).json({ error: "forbidden" });

    const { userId, verified } = req.body;

    const updated = await DriverService.setDriverVerified(userId, verified);
    return res.json({ ok: true, driver: updated });
  },

  /**
   * GET /drivers
   */
  async list(req: AuthRequest, res: Response) {
    const rows = await DriverService.listDrivers();
    return res.json({ drivers: rows });
  },
};
