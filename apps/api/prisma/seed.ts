/**
 * SisiMove — Seed v3
 * Fully typed, deterministic, production-safe seed script
 */

import {
  PrismaClient,
  UserRole,
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  TripStatus,
  LedgerType,
} from "@prisma/client";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// -----------------------------------------------------
// 👇 STRICTLY TYPED LOCATION TUPLE FIX
// -----------------------------------------------------
type TripLocation = [
  origin: string,
  destination: string,
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
];

const locations: TripLocation[] = [
  ["Nairobi CBD", "Thika", -1.286, 36.817, -1.04, 37.07],
  ["Westlands", "JKIA", -1.264, 36.80, -1.319, 36.92],
  ["Kilimani", "Kitengela", -1.30, 36.79, -1.47, 36.96],
  ["Rongai", "Kiserian", -1.39, 36.76, -1.43, 36.71],
  ["Eastleigh", "CBD", -1.27, 36.85, -1.28, 36.82],
  ["Pipeline", "South C", -1.31, 36.89, -1.32, 36.81],
  ["Lavington", "Karen", -1.29, 36.77, -1.34, 36.72],
  ["CBD", "Westlands", -1.28, 36.82, -1.26, 36.80],
  ["Donholm", "Buruburu", -1.29, 36.89, -1.28, 36.89],
  ["Embakasi", "Syokimau", -1.32, 36.89, -1.36, 36.94],
];

// -----------------------------------------------------
// RANDOM HELPERS
// -----------------------------------------------------
function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomPhone() {
  return "07" + randomInt(10000000, 99999999).toString();
}

// -----------------------------------------------------

async function main() {
  console.log("🌱 SisiMove Seed v3 Starting...");

  //----------------------------------------------------
  // ADMIN
  //----------------------------------------------------
  const adminHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@sisimove.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@sisimove.com",
      phone: "0710000000",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
    },
  });

  console.log("✔ Admin created");

  //----------------------------------------------------
  // DRIVERS + VEHICLES (10)
  //----------------------------------------------------
  const drivers = [];

  for (let i = 1; i <= 10; i++) {
    const phone = "07910000" + i;

    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        name: `Driver ${i}`,
        phone,
        passwordHash: adminHash,
        role: UserRole.DRIVER,
      },
    });

    const driver = await prisma.driver.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        verified: true,
        rating: 4.5,
      },
    });

    await prisma.vehicle.upsert({
      where: { driverId: driver.id },
      update: {},
      create: {
        driverId: driver.id,
        make: "Toyota",
        model: "Fielder",
        plate: `KDA ${100 + i}C`,
        color: "White",
      },
    });

    drivers.push(driver);
  }

  console.log("✔ 10 Drivers & vehicles");

  //----------------------------------------------------
  // PASSENGERS (20)
  //----------------------------------------------------
  const passengerHash = await bcrypt.hash("Passenger123!", 10);
  const passengers = [];

  for (let i = 1; i <= 20; i++) {
    const phone = "07920000" + i;

    const user = await prisma.user.upsert({
      where: { phone },
      update: {},
      create: {
        name: `Passenger ${i}`,
        phone,
        passwordHash: passengerHash,
        role: UserRole.PASSENGER,
      },
    });

    passengers.push(user);
  }

  console.log("✔ 20 Passengers created");

  //----------------------------------------------------
  // TRIPS (10)
  //----------------------------------------------------

  const trips = [];

  for (let i = 0; i < 10; i++) {
    const loc = locations[i];
    const driver = drivers[i % drivers.length];

    const trip = await prisma.trip.create({
      data: {
        driverId: driver.id,
        origin: loc[0],
        destination: loc[1],
        originLat: loc[2],
        originLng: loc[3],
        destLat: loc[4],
        destLng: loc[5],
        priceCents: randomInt(10000, 30000),
        availableSeats: randomInt(1, 4),
        departureAt: new Date(Date.now() + randomInt(1, 5) * 3600 * 1000),
        status: TripStatus.DRIVER_ASSIGNED,
      },
    });

    trips.push(trip);
  }

  console.log("✔ 10 Trips created");

  //----------------------------------------------------
  // BOOKINGS (30) + PAYMENTS (30)
  //----------------------------------------------------
  const bookings = [];

  for (let i = 0; i < 30; i++) {
    const trip = rand(trips);
    const passenger = rand(passengers);

    const seats = randomInt(1, 3);
    const total = trip.priceCents * seats;

    const booking = await prisma.booking.create({
      data: {
        userId: passenger.id,
        tripId: trip.id,
        seats,
        totalCents: total,
        status: BookingStatus.PAID,
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        userId: passenger.id,
        provider: rand([PaymentProvider.MPESA, PaymentProvider.STRIPE]),
        reference: `TX-${Date.now()}-${i}`,
        phone: passenger.phone,
        amountCents: total,
        status: PaymentStatus.SUCCESS,
      },
    });

    bookings.push(booking);
  }

  console.log("✔ 30 bookings + payments");

  //----------------------------------------------------
  // LEDGER ENTRIES (payout + earnings)
  //----------------------------------------------------

  const payoutDrivers = drivers.slice(0, 5);
  const payouts = [];

  for (const driver of payoutDrivers) {
    const amount = randomInt(50000, 150000);

    const payout = await prisma.payout.create({
      data: {
        driverId: driver.id,
        amount,
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    await prisma.ledgerEntry.create({
      data: {
        driverId: driver.id,
        payoutId: payout.id,
        amount,
        type: LedgerType.PAYOUT,
        reference: `B2C-${payout.id}`,
      },
    });

    payouts.push(payout);
  }

  console.log("✔ Payouts + ledger entries created");

  //----------------------------------------------------
  // SETTINGS
  //----------------------------------------------------

  await prisma.systemSetting.upsert({
    where: { key: "platform_fee_pct" },
    update: { value: "0.10" },
    create: { key: "platform_fee_pct", value: "0.10" },
  });

  await prisma.systemSetting.upsert({
    where: { key: "mpesa_b2c_minimum" },
    update: { value: "100" },
    create: { key: "mpesa_b2c_minimum", value: "100" },
  });

  //----------------------------------------------------
  // PROMOS
  //----------------------------------------------------
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
    where: { code: "SISI20" },
    update: {},
    create: {
      code: "SISI20",
      discountPct: 20,
      active: true,
    },
  });

  console.log("🔥 SEED v3 COMPLETE!");
}

// Run
main()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
