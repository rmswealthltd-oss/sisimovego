-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "sisimove_schema";

-- CreateEnum
CREATE TYPE "sisimove_schema"."VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."DocumentType" AS ENUM ('GOVERNMENT_ID', 'DRIVER_LICENSE');

-- CreateEnum
CREATE TYPE "sisimove_schema"."TripStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."PaymentProvider" AS ENUM ('MPESA', 'STRIPE', 'CASH');

-- CreateEnum
CREATE TYPE "sisimove_schema"."PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."RefundStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "sisimove_schema"."LedgerType" AS ENUM ('BOOKING_PAYMENT', 'BOOKING_RESERVE', 'RIDE_PAYMENT', 'DRIVER_EARNING', 'PLATFORM_FEE', 'REFUND', 'REFUND_DEBIT', 'TRIP_EARNING', 'DRIVER_PAYOUT', 'PAYOUT', 'WITHDRAWAL', 'TOPUP', 'PROMO', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "sisimove_schema"."EntryDirection" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "sisimove_schema"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED', 'REFUNDED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."WalletType" AS ENUM ('ESCROW', 'DRIVER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "sisimove_schema"."PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "sisimove_schema"."LedgerEntityType" AS ENUM ('TRIP', 'BOOKING', 'USER');

-- CreateTable
CREATE TABLE "sisimove_schema"."User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "suspended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "governmentIdStatus" "sisimove_schema"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "driverLicenseStatus" "sisimove_schema"."VerificationStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "sisimove_schema"."DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "sisimove_schema"."VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Driver" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "rating" DOUBLE PRECISION DEFAULT 5.0,
    "walletId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Wallet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "type" "sisimove_schema"."WalletType" NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Trip" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pricePerSeat" INTEGER NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "notes" TEXT,
    "status" "sisimove_schema"."TripStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" TEXT,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."TripRequest" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "status" "sisimove_schema"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Booking" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "amountCents" INTEGER NOT NULL DEFAULT 0,
    "amountPaid" INTEGER NOT NULL DEFAULT 0,
    "status" "sisimove_schema"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "provider" "sisimove_schema"."PaymentProvider",
    "providerTxId" TEXT,
    "idempotencyKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Message" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Rating" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "status" "sisimove_schema"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tripRequestId" TEXT,
    "bookingId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Refund" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT,
    "bookingId" TEXT,
    "status" "sisimove_schema"."RefundStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "ruleHits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."FraudRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "script" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FraudRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."FraudEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ruleId" TEXT,
    "score" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."FraudCase" (
    "id" TEXT NOT NULL,
    "refundId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FraudCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Payout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "driverId" TEXT,
    "batchId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "providerTxId" TEXT,
    "status" "sisimove_schema"."PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "phone" TEXT,
    "description" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."PayoutBatch" (
    "id" TEXT NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayoutBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."LedgerEntry" (
    "id" TEXT NOT NULL,
    "ledgerId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "direction" "sisimove_schema"."EntryDirection" NOT NULL,
    "payoutId" TEXT,
    "userId" TEXT,
    "bookingId" TEXT,
    "reference" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."NotificationSetting" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."PaymentCallback" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerTxId" TEXT NOT NULL,
    "rawPayload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentCallback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."OutboxEvent" (
    "id" TEXT NOT NULL,
    "aggregateType" TEXT,
    "aggregateId" TEXT,
    "type" TEXT NOT NULL,
    "channel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'READY',
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."DeadLetter" (
    "id" TEXT NOT NULL,
    "source" TEXT,
    "payload" JSONB NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeadLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."PromoCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPct" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."CronState" (
    "id" TEXT NOT NULL,
    "lastRun" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CronState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."SystemSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."Ledger" (
    "id" TEXT NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "type" "sisimove_schema"."LedgerType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."DLQ" (
    "id" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DLQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."TripStatusAudit" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripStatusAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sisimove_schema"."WebhookLog" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "success" BOOLEAN NOT NULL,
    "errorMessage" TEXT,
    "deliveredAt" TIMESTAMP(3),
    "replayCount" INTEGER NOT NULL DEFAULT 0,
    "lastReplayAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "sisimove_schema"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "sisimove_schema"."User"("phone");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "sisimove_schema"."Document"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_userId_key" ON "sisimove_schema"."Driver"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_walletId_key" ON "sisimove_schema"."Driver"("walletId");

-- CreateIndex
CREATE INDEX "Wallet_ownerId_idx" ON "sisimove_schema"."Wallet"("ownerId");

-- CreateIndex
CREATE INDEX "Wallet_type_idx" ON "sisimove_schema"."Wallet"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_ownerId_type_key" ON "sisimove_schema"."Wallet"("ownerId", "type");

-- CreateIndex
CREATE INDEX "Trip_ownerId_idx" ON "sisimove_schema"."Trip"("ownerId");

-- CreateIndex
CREATE INDEX "Trip_date_idx" ON "sisimove_schema"."Trip"("date");

-- CreateIndex
CREATE INDEX "Trip_fromLocation_toLocation_idx" ON "sisimove_schema"."Trip"("fromLocation", "toLocation");

-- CreateIndex
CREATE INDEX "TripRequest_tripId_idx" ON "sisimove_schema"."TripRequest"("tripId");

-- CreateIndex
CREATE INDEX "TripRequest_userId_idx" ON "sisimove_schema"."TripRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_providerTxId_key" ON "sisimove_schema"."Booking"("providerTxId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "sisimove_schema"."Booking"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Booking_tripId_idx" ON "sisimove_schema"."Booking"("tripId");

-- CreateIndex
CREATE INDEX "Booking_passengerId_idx" ON "sisimove_schema"."Booking"("passengerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "sisimove_schema"."Booking"("status");

-- CreateIndex
CREATE INDEX "Message_tripId_idx" ON "sisimove_schema"."Message"("tripId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "sisimove_schema"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Rating_tripId_idx" ON "sisimove_schema"."Rating"("tripId");

-- CreateIndex
CREATE INDEX "Rating_authorId_idx" ON "sisimove_schema"."Rating"("authorId");

-- CreateIndex
CREATE INDEX "Rating_recipientId_idx" ON "sisimove_schema"."Rating"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_tripRequestId_key" ON "sisimove_schema"."Payment"("tripRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bookingId_key" ON "sisimove_schema"."Payment"("bookingId");

-- CreateIndex
CREATE INDEX "Refund_userId_idx" ON "sisimove_schema"."Refund"("userId");

-- CreateIndex
CREATE INDEX "Refund_paymentId_idx" ON "sisimove_schema"."Refund"("paymentId");

-- CreateIndex
CREATE INDEX "Refund_bookingId_idx" ON "sisimove_schema"."Refund"("bookingId");

-- CreateIndex
CREATE INDEX "FraudEvent_userId_idx" ON "sisimove_schema"."FraudEvent"("userId");

-- CreateIndex
CREATE INDEX "FraudEvent_ruleId_idx" ON "sisimove_schema"."FraudEvent"("ruleId");

-- CreateIndex
CREATE INDEX "Payout_userId_idx" ON "sisimove_schema"."Payout"("userId");

-- CreateIndex
CREATE INDEX "Payout_driverId_idx" ON "sisimove_schema"."Payout"("driverId");

-- CreateIndex
CREATE INDEX "LedgerEntry_ledgerId_idx" ON "sisimove_schema"."LedgerEntry"("ledgerId");

-- CreateIndex
CREATE INDEX "LedgerEntry_walletId_idx" ON "sisimove_schema"."LedgerEntry"("walletId");

-- CreateIndex
CREATE INDEX "LedgerEntry_userId_idx" ON "sisimove_schema"."LedgerEntry"("userId");

-- CreateIndex
CREATE INDEX "LedgerEntry_bookingId_idx" ON "sisimove_schema"."LedgerEntry"("bookingId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "sisimove_schema"."Notification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSetting_userId_key" ON "sisimove_schema"."NotificationSetting"("userId");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "sisimove_schema"."PushSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_endpoint_key" ON "sisimove_schema"."PushSubscription"("userId", "endpoint");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentCallback_providerTxId_key" ON "sisimove_schema"."PaymentCallback"("providerTxId");

-- CreateIndex
CREATE INDEX "PaymentCallback_provider_idx" ON "sisimove_schema"."PaymentCallback"("provider");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_idx" ON "sisimove_schema"."OutboxEvent"("status");

-- CreateIndex
CREATE INDEX "OutboxEvent_processed_idx" ON "sisimove_schema"."OutboxEvent"("processed");

-- CreateIndex
CREATE INDEX "OutboxEvent_aggregateId_idx" ON "sisimove_schema"."OutboxEvent"("aggregateId");

-- CreateIndex
CREATE INDEX "OutboxEvent_type_idx" ON "sisimove_schema"."OutboxEvent"("type");

-- CreateIndex
CREATE INDEX "DeadLetter_source_idx" ON "sisimove_schema"."DeadLetter"("source");

-- CreateIndex
CREATE UNIQUE INDEX "PromoCode_code_key" ON "sisimove_schema"."PromoCode"("code");

-- CreateIndex
CREATE INDEX "TripStatusAudit_tripId_idx" ON "sisimove_schema"."TripStatusAudit"("tripId");

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Driver" ADD CONSTRAINT "Driver_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Driver" ADD CONSTRAINT "Driver_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "sisimove_schema"."Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Wallet" ADD CONSTRAINT "Wallet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Trip" ADD CONSTRAINT "Trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "sisimove_schema"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."TripRequest" ADD CONSTRAINT "TripRequest_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "sisimove_schema"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."TripRequest" ADD CONSTRAINT "TripRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Booking" ADD CONSTRAINT "Booking_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "sisimove_schema"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Booking" ADD CONSTRAINT "Booking_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Message" ADD CONSTRAINT "Message_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "sisimove_schema"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Rating" ADD CONSTRAINT "Rating_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "sisimove_schema"."Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Rating" ADD CONSTRAINT "Rating_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Rating" ADD CONSTRAINT "Rating_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payment" ADD CONSTRAINT "Payment_tripRequestId_fkey" FOREIGN KEY ("tripRequestId") REFERENCES "sisimove_schema"."TripRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "sisimove_schema"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Refund" ADD CONSTRAINT "Refund_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "sisimove_schema"."Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Refund" ADD CONSTRAINT "Refund_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "sisimove_schema"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."FraudEvent" ADD CONSTRAINT "FraudEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."FraudEvent" ADD CONSTRAINT "FraudEvent_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "sisimove_schema"."FraudRule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."FraudCase" ADD CONSTRAINT "FraudCase_refundId_fkey" FOREIGN KEY ("refundId") REFERENCES "sisimove_schema"."Refund"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payout" ADD CONSTRAINT "Payout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payout" ADD CONSTRAINT "Payout_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "sisimove_schema"."Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Payout" ADD CONSTRAINT "Payout_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "sisimove_schema"."PayoutBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "sisimove_schema"."Ledger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "sisimove_schema"."Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "sisimove_schema"."Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."LedgerEntry" ADD CONSTRAINT "LedgerEntry_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "sisimove_schema"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."NotificationSetting" ADD CONSTRAINT "NotificationSetting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Ledger" ADD CONSTRAINT "Ledger_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "sisimove_schema"."Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."TripStatusAudit" ADD CONSTRAINT "TripStatusAudit_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "sisimove_schema"."Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
