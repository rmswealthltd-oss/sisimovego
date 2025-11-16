// src/modules/admin/dlq.service.ts
import prisma from "../../db";

export const AdminDLQService = {
  async list(limit = 200) {
    return prisma.dlq.findMany({
      orderBy: { createdAt: "desc" },
      take: limit
    });
  },

  async clearAll() {
    await prisma.dlq.deleteMany({});
    return { ok: true };
  }
};
