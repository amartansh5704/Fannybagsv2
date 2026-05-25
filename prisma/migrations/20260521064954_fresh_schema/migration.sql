/*
  Warnings:

  - Added the required column `updatedAt` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "maxInvestment" DOUBLE PRECISION,
ADD COLUMN     "minInvestment" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "description" TEXT,
ADD COLUMN     "genre" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "fanId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "ownershipPct" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SongMetrics" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "totalStreams" INTEGER NOT NULL DEFAULT 0,
    "monthlyStreams" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyRevenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fanPayoutsTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "artistEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInvestors" INTEGER NOT NULL DEFAULT 0,
    "campaignGrowthPct" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SongMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongMetrics_songId_key" ON "SongMetrics"("songId");

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SongMetrics" ADD CONSTRAINT "SongMetrics_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
