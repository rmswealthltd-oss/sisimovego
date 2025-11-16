/**
 * SisiMove — Prisma Seed Script
 * Safe, idempotent, production-ready
 */

import { PrismaClient, UserRole, PaymentProvider, PaymentStatus, BookingStatus, TripStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SisiMove seed...");

  // -------------------------
  // ADMIN USER
  // -------------------------

  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sisimove.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@sisimove.com",
      phone: "0710000000",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log("✔ Admin created:", admin.email);

  // -------------------------
  // DRIVERS + VEHICLES
  // -------------------------

  const driverData = [
    { name: "John Mwangi", phone: "0711111111", plate: "KDA 123C" },
    { name: "Sarah Otieno", phone: "0722222222", plate: "KDB 987A" },
    { name: "Peter Kamau", phone: "0733333333", plate: "KDC 456B" },
  ];

  const drivers = [];

  for (const d of driverData) {
    const user = await prisma.user.upsert({
      where: { phone: d.phone },
      update: {},
      create: {
        name: d.name,
        phone: d.phone,
        passwordHash: adminPassword,
        role: UserRole.DRIVER,
      },
    });

    const driver = await prisma.driver.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        verified: true,
      },
    });

    await prisma.vehicle.upsert({
      where: { driverId: driver.id },
      update: {},
      create: {
        driverId: driver.id,
        plate: d.plate,
        make: "Toyota",
        model: "Axio",
        color: "White",
      },
    });

    drivers.push(driver);
  }

  console.log("✔ Drivers created:", drivers.length);

  // -------------------------
  // PASSENGERS
  // -------------------------

  const passengerPassword = await bcrypt.hash("Passenger123!", 10);

  const passenger1 = await prisma.user.upsert({
    where: { phone: "0790000001" },
    update: {},
    create: {
      name: "Alice Njeri",
      phone: "0790000001",
      passwordHash: passengerPassword,
      role: UserRole.PASSENGER,
    },
  });

  const passenger2 = await prisma.user.upsert({
    where: { phone: "0790000002" },
    update: {},
    create: {
      name: "David Ouko",
      phone: "0790000002",
      passwordHash: passengerPassword,
      role: UserRole.PASSENGER,
    },
  });

  console.log("✔ Passengers created");

  // -------------------------
  // SAMPLE TRIPS
  // -------------------------

  const now = new Date();
  const twoHours = new Date(now.getTime() + 1000 * 60 * 60 * 2);

  const trip1 = await prisma.trip.create({
    data: {
      driverId: drivers[0].id,
      origin: "Nairobi CBD",
      destination: "Thika",
      originLat: -1.286389,
      originLng: 36.817223,
      destLat: -1.0421,
      destLng: 37.0707,
      priceCents: 20000,
      availableSeats: 3,
      departureAt: twoHours,
      status: TripStatus.DRIVER_ASSIGNED,
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      driverId: drivers[1].id,
      origin: "Westlands",
      destination: "JKIA Airport",
      originLat: -1.2649,
      originLng: 36.8049,
      destLat: -1.3192,
      destLng: 36.9278,
      priceCents: 15000,
      availableSeats: 2,
      departureAt: twoHours,
      status: TripStatus.DRIVER_ASSIGNED,
    },
  });

  console.log("✔ Trips created");

  // -------------------------
  // BOOKINGS + PAYMENTS
  // -------------------------

  const booking1 = await prisma.booking.create({
    data: {
      userId: passenger1.id,
      tripId: trip1.id,
      seats: 1,
      status: BookingStatus.PAID,
      totalCents: 20000,
    },
  });

  const payment1 = await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      userId: passenger1.id,
      provider: PaymentProvider.MPESA,
      reference: "MPESA-TEST-12345",
      phone: passenger1.phone!,
      amountCents: 20000,
      status: PaymentStatus.SUCCESS,
    },
  });

  console.log("✔ Bookings + payments created");

  // -------------------------
  // PROMO CODES
  // -------------------------

  await prisma.promoCode.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountPct: 10,
      active: true,
    },
  });

  await prisma.promoCode.upsert({
    where: { code: "SISIMOVE20" },
    update: {},
    create: {
      code: "SISIMOVE20",
      discountPct: 20,
      active: true,
    },
  });

  console.log("✔ Promo codes created");

  // -------------------------
  // CONFIG ITEMS
  // -------------------------

  await prisma.configItem.upsert({
    where: { key: "platform_fee_pct" },
    update: { value: 0.1 },
    create: {
      key: "platform_fee_pct",
      value: 0.1,
    },
  });

  await prisma.configItem.upsert({
    where: { key: "mpesa_b2c_minimum" },
    update: { value: 100 },
    create: {
      key: "mpesa_b2c_minimum",
      value: 100,
    },
  });

  console.log("✔ Config created");

  console.log("🌱 SEED COMPLETE!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
