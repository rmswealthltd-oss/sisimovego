// prisma/seed.ts
import {
  PrismaClient,
  TripStatus,
  RequestStatus,
  BookingStatus,
  PaymentProvider,
  PaymentStatus,
  RefundStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const cities = [
  "Nairobi",
  "Mombasa",
  "Nakuru",
  "Kisumu",
  "Eldoret",
  "Thika",
  "Machakos",
  "Naivasha",
  "Meru",
  "Nyeri",
];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Seeding SisiMove database — please wait...");

  // --- 0️⃣ Ensure admin exists
  const adminEmail = "admin@sisimove.com";
  const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await prisma.user.create({
      data: {
        firstName: "Admin",
        lastName: "SisiMove",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✔ Admin user created:", adminEmail, "/ password123");
  }

  // --- 1️⃣ Create drivers and passengers
  const drivers: { id: string }[] = [];
  const passengers: { id: string }[] = [];

  for (let i = 1; i <= 5; i++) {
    const email = `driver${i}@example.com`;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      drivers.push({ id: existing.id });
      continue;
    }

    const hashedPassword = await bcrypt.hash(`seed-driver-${i}`, 10);
    const user = await prisma.user.create({
      data: {
        firstName: `Driver${i}`,
        lastName: "Seed",
        email,
        phone: `+25470000010${i}`,
        passwordHash: hashedPassword,
        governmentIdStatus: "APPROVED",
        driverLicenseStatus: "APPROVED",
      },
    });
    drivers.push({ id: user.id });

    await prisma.document.create({
      data: {
        id: `doc-driver-${user.id}`,
        userId: user.id,
        type: "DRIVER_LICENSE",
        fileUrl: "https://example.com/docs/driver-license.pdf",
        status: "APPROVED",
      },
    });

    await prisma.driver.create({
      data: {
        userId: user.id,
        rating: 4.8,
      },
    });
  }

  for (let i = 1; i <= 10; i++) {
    const email = `passenger${i}@example.com`;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      passengers.push({ id: existing.id });
      continue;
    }

    const hashedPassword = await bcrypt.hash(`seed-pass-${i}`, 10);
    const user = await prisma.user.create({
      data: {
        firstName: `Passenger${i}`,
        lastName: "Seed",
        email,
        phone: `+2547111100${i}`,
        passwordHash: hashedPassword,
        governmentIdStatus: "APPROVED",
        driverLicenseStatus: "PENDING",
      },
    });
    passengers.push({ id: user.id });

    await prisma.document.create({
      data: {
        id: `doc-passenger-${user.id}`,
        userId: user.id,
        type: "GOVERNMENT_ID",
        fileUrl: "https://example.com/docs/gov-id.pdf",
        status: "APPROVED",
      },
    });
  }

  console.log(`✔ Created ${drivers.length} drivers and ${passengers.length} passengers`);

  // --- 2️⃣ Create trips
  const trips = [];
  for (let i = 0; i < 10; i++) {
    const driver = rand(drivers);
    const from = rand(cities);
    let to = rand(cities);
    while (to === from) to = rand(cities);

    const totalSeats = randInt(2, 4);
    const availableSeats = randInt(1, totalSeats);

    const trip = await prisma.trip.create({
      data: {
        ownerId: driver.id,
        fromLocation: from,
        toLocation: to,
        date: new Date(Date.now() + randInt(1, 14) * 24 * 60 * 60 * 1000),
        pricePerSeat: randInt(300, 1500),
        totalSeats,
        availableSeats,
        status: TripStatus.ACTIVE,
        notes: `Seed trip ${i + 1} from ${from} to ${to}`,
      },
    });

    trips.push(trip);
  }

  console.log("✔ Created 10 trips");

  // --- 3️⃣ Create tripRequests, bookings, payments, and occasional refunds
  for (const trip of trips) {
    const requestsCount = randInt(1, 3);
    for (let r = 0; r < requestsCount; r++) {
      const passenger = rand(passengers);

      const tripRequest = await prisma.tripRequest.create({
        data: {
          tripId: trip.id,
          userId: passenger.id,
          seats: 1,
          status: rand([
            RequestStatus.PENDING,
            RequestStatus.ACCEPTED,
            RequestStatus.DECLINED,
            RequestStatus.CANCELLED,
          ]),
        },
      });

      const makeBooking = Math.random() < 0.6;

      if (makeBooking) {
        const booking = await prisma.booking.create({
          data: {
            tripId: trip.id,
            passengerId: passenger.id,
            seats: 1,
            amountCents: trip.pricePerSeat * 100,
            amountPaid: trip.pricePerSeat * 100,
            status: BookingStatus.PAID,
            provider: PaymentProvider.MPESA,
            providerTxId: `seed-tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        });

        await prisma.payment.create({
          data: {
            amount: booking.amountPaid,
            method: PaymentProvider.MPESA,
            status: PaymentStatus.SUCCESS,
            bookingId: booking.id,
            userId: passenger.id,
          },
        });
      }
    }
  }

  console.log("✔ Created tripRequests, bookings, and payments");
  console.log("🌱 Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
