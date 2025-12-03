// src/modules/trips/tripStatusAudit.service.ts
import prisma from "../../db";

/**
 * TripStatusAuditService:
 * Stores and reads trip status audit timeline.
 * Defensive: if tripStatusAudit model isn't present in schema, it will fail silently.
 */

export const TripStatusAuditService = {
  async logChange(tripId: string, status: string, adminId?: string, note?: string) {
    try {
      return await prisma.tripStatusAudit.create({
        data: {
          tripId,
          status,
          adminId: adminId ?? null,
          note: note ?? null
        } as any
      });
    } catch (e) {
      // model might not exist — fallback to outbox
      await prisma.outboxEvent.create({
        data: {
          aggregateType: "TripStatusAudit",
          aggregateId: tripId,
          type: "TripStatusAuditFallback",
          payload: JSON.stringify({ tripId, status, adminId, note }),
          channel: "admin",
          status: "READY"
        }
      }).catch(() => null);
      return null;
    }
  },

  async getTimeline(tripId: string) {
    try {
      return await prisma.tripStatusAudit.findMany({
        where: { tripId },
        orderBy: { createdAt: "asc" }
      });
    } catch (e) {
      // model missing -> try to reconstruct from outbox events (best-effort)
      const rows = await prisma.outboxEvent.findMany({
        where: { aggregateType: "Trip", aggregateId: tripId },
        orderBy: { createdAt: "asc" }
      });
      return rows.map((r: any) => ({ id: r.id, status: r.type, createdAt: r.createdAt, meta: r.payload }));
    }
  }
};
