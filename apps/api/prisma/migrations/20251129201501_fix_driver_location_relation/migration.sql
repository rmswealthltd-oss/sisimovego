-- CreateTable
CREATE TABLE "sisimove_schema"."DriverLocation" (
    "driverId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "bearing" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverLocation_pkey" PRIMARY KEY ("driverId")
);

-- AddForeignKey
ALTER TABLE "sisimove_schema"."DriverLocation" ADD CONSTRAINT "DriverLocation_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "sisimove_schema"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
