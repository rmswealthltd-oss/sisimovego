import { Router } from "express";
import prisma from "../../db";
import { z } from "zod";

const router = Router();

// -------------------------
// Schema
// -------------------------
const CheckoutSchema = z.object({
  bookingId: z.string().uuid(),
  method: z.enum(["mpesa", "stripe"]),
});

// -------------------------
// Create Checkout Session
// -------------------------
router.post("/", async (req, res) => {
  const parse = CheckoutSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid payload", details: parse.error.format() });
  }

  const { bookingId, method } = parse.data;

  // 1. Lookup Booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  // A logical checkout ID (same for MPESA + Stripe)
  const checkoutId = crypto.randomUUID();

  // 2. Store checkout attempt in DB (OPTIONAL)
  await prisma.payment.create({
    data: {
      id: checkoutId,
      amount: booking.amountCents,
      method,
      status: "PENDING",
      bookingId: booking.id,
      userId: booking.passengerId
    }
  });

  // 3. Stripe checkout (if selected)
  if (method === "stripe") {
    const redirectUrl = `https://checkout.stripe.com/pay/${checkoutId}`;
    return res.json({ checkoutId, redirectUrl });
  }

  // 4. MPESA checkout
  return res.json({
    checkoutId,
    redirectUrl: null
  });
});

export default router;
