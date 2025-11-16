// src/modules/payments/stripe.service.ts
import prisma from "../../db";

/**
 * Stripe service stub. Replace with official stripe SDK integration.
 * Keep idempotency in mind: use an idempotency key per client request.
 */

export const StripeService = {
  async createPaymentIntent({ amountCents, currency = "KES", metadata = {} }: { amountCents: number; currency?: string; metadata?: Record<string, any> }) {
    // TODO: call stripe.paymentIntents.create(...)
    // For now return a fake clientSecret and id
    const fakeId = `pi_${Date.now()}`;
    return {
      id: fakeId,
      clientSecret: `${fakeId}_secret_${Math.random().toString(36).slice(2)}`,
      amount: amountCents,
      currency
    };
  },

  async handleWebhook(payload: any) {
    // parse stripe event and then persist callback / reconcile booking similar to mpesa handler
    // This is a stub: implement secure signature verification with Stripe-Signature header
    return { ok: true };
  }
};
