-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'artist',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "demoUrl" TEXT,
    "coverArtUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribution" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "releaseStatus" TEXT NOT NULL,
    "releaseName" TEXT,
    "primaryGenre" TEXT,
    "releaseDate" TIMESTAMP(3),
    "explicitLyrics" BOOLEAN NOT NULL DEFAULT false,
    "primaryArtist" TEXT,
    "additionalArtists" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "songFileUrl" TEXT,
    "hasFreeBeat" BOOLEAN NOT NULL DEFAULT false,
    "migrationApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "totalFundingAsk" DOUBLE PRECISION NOT NULL,
    "fanRevenueShare" DOUBLE PRECISION NOT NULL,
    "campaignEndDate" TIMESTAMP(3) NOT NULL,
    "royaltySharingOn" BOOLEAN NOT NULL DEFAULT true,
    "campaignStory" TEXT,
    "budgetProduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetMixMaster" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetVideoPromo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetMarketing" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "budgetOther" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "amountRaised" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Distribution_songId_key" ON "Distribution"("songId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_songId_key" ON "Campaign"("songId");

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
