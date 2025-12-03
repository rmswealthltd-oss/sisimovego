// apps/api/src/modules/notifications/push.service.ts

import webpush from "web-push";
import prisma from "../../db";
import { env } from "../../env";

/* ---------------------------------------------------------------------
   WEB PUSH INITIALIZATION
--------------------------------------------------------------------- */

if (!env.PUSH_PUBLIC_KEY || !env.PUSH_PRIVATE_KEY) {
  console.error("[PUSH] Missing VAPID keys. Generate with:");
  console.error("   npx web-push generate-vapid-keys");
}

webpush.setVapidDetails(
  env.PUSH_CONTACT_EMAIL,
  env.PUSH_PUBLIC_KEY,
  env.PUSH_PRIVATE_KEY
);

export const PushService = {
  /* ---------------------------------------------------------------------
     SAVE SUBSCRIPTION (UPSERT)
  --------------------------------------------------------------------- */

  async saveSubscription(userId: string, subscription: any) {
    const endpoint = subscription?.endpoint;
    const p256dh = subscription?.keys?.p256dh;
    const auth = subscription?.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      throw new Error("Invalid Web Push subscription");
    }

    return prisma.pushSubscription.upsert({
      where: {
        // ✔ composite unique key valid because you added:
        // @@unique([userId, endpoint], name: "userId_endpoint")
        userId_endpoint: {
          userId,
          endpoint,
        },
      },
      create: {
        userId,
        endpoint,
        p256dh,
        auth,
      },
      update: {
        p256dh,
        auth,
      },
    });
  },

  /* ---------------------------------------------------------------------
     SEND TO A SINGLE SUBSCRIPTION
     Automatically removes stale/expired entries.
  --------------------------------------------------------------------- */

  async sendToSubscription(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: null,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (err: any) {
      // 410 = Gone (expired), 404 = Not found
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        console.warn("[PUSH] Removing stale subscription:", subscription.endpoint);

        await prisma.pushSubscription.delete({
          where: {
            userId_endpoint: {
              userId: subscription.userId,
              endpoint: subscription.endpoint,
            },
          },
        }).catch(() => null);

      } else {
        console.error("[PUSH] Error sending notification:", err);
      }
    }
  },

  /* ---------------------------------------------------------------------
     SEND TO ALL USER SUBSCRIPTIONS
  --------------------------------------------------------------------- */

  async sendToUser(userId: string, payload: any) {
    const subs = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    for (const s of subs) {
      await this.sendToSubscription(s, payload);
    }
  },

  /* ---------------------------------------------------------------------
     BROADCAST VIA OUTBOX
  --------------------------------------------------------------------- */

  async broadcast(payload: any, userIds: string[]) {
    await prisma.outboxEvent.create({
      data: {
        aggregateType: "PushBroadcast",
        aggregateId: "broadcast",
        type: "PushBroadcast",
        channel: "push",
        payload: JSON.stringify({ userIds, payload }),
        status: "READY",
      },
    });

    return { ok: true };
  },

  /* ---------------------------------------------------------------------
     BUILD PWA NOTIFICATION PAYLOAD
  --------------------------------------------------------------------- */

  buildNotification(title: string, body: string, data: any = {}) {
    return {
      title,
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data,
    };
  },
};
