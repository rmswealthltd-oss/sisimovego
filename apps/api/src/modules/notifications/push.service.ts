// apps/api/src/modules/notifications/push.service.ts
import webpush from "web-push";
import prisma from "../../db";
import { env } from "../../env";

/**
 * -------------------------------------------------------------------------
 * WEB PUSH INITIALIZATION
 * -------------------------------------------------------------------------
 */

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
  /**
   * ---------------------------------------------------------------------
   * SAVE SUBSCRIPTION (UPSERT)
   * ---------------------------------------------------------------------
   */
  async saveSubscription(userId: string, subscription: any) {
    return prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId,
          endpoint: subscription.endpoint
        }
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth
      }
    });
  },

  /**
   * ---------------------------------------------------------------------
   * SEND TO SINGLE SUBSCRIPTION
   * Handles expired subscriptions automatically.
   * ---------------------------------------------------------------------
   */
  async sendToSubscription(subscription: any, payload: any) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: null,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth
          }
        },
        JSON.stringify(payload)
      );
    } catch (err: any) {
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        console.warn("[PUSH] Removing stale subscription:", subscription.endpoint);

        await prisma.pushSubscription
          .delete({
            where: {
              userId_endpoint: {
                userId: subscription.userId,
                endpoint: subscription.endpoint
              }
            }
          })
          .catch(() => null);
      } else {
        console.error("[PUSH] Error sending:", err);
      }
    }
  },

  /**
   * ---------------------------------------------------------------------
   * SEND TO ALL SUBSCRIPTIONS OF A USER
   * ---------------------------------------------------------------------
   */
  async sendToUser(userId: string, payload: any) {
    const subs = await prisma.pushSubscription.findMany({
      where: { userId }
    });

    for (const s of subs) {
      await this.sendToSubscription(s, payload);
    }
  },

  /**
   * ---------------------------------------------------------------------
   * BROADCAST THROUGH OUTBOX (Async Worker)
   * ---------------------------------------------------------------------
   */
  async broadcast(payload: any, userIds: string[]) {
    await prisma.outbox.create({
      data: {
        aggregateType: "PushBroadcast",
        aggregateId: "broadcast",
        type: "PushBroadcast",
        channel: "push",
        payload: JSON.stringify({ userIds, payload }),
        status: "READY"
      }
    });

    return { ok: true };
  },

  /**
   * ---------------------------------------------------------------------
   * FORMAT NOTIFICATION PAYLOAD (PWA Spec)
   * ---------------------------------------------------------------------
   */
  buildNotification(title: string, body: string, data: any = {}) {
    return {
      title,
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      data
    };
  }
};
