-- CreateTable
CREATE TABLE "sisimove_schema"."Support" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "message" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Support_userId_idx" ON "sisimove_schema"."Support"("userId");

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Support" ADD CONSTRAINT "Support_userId_fkey" FOREIGN KEY ("userId") REFERENCES "sisimove_schema"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sisimove_schema"."Support" ADD CONSTRAINT "Support_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "sisimove_schema"."Support"("id") ON DELETE SET NULL ON UPDATE CASCADE;
