-- CreateTable
CREATE TABLE "KhapeetarProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "primaryRole" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'India',
    "workMode" TEXT NOT NULL DEFAULT 'Remote',
    "availability" TEXT NOT NULL DEFAULT 'Available Now',
    "startingBudget" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "projectsCompleted" INTEGER NOT NULL DEFAULT 0,
    "bio" TEXT,
    "profileImage" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "spotifyCredits" TEXT,
    "portfolioLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KhapeetarProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DealRequest" (
    "id" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "artistName" TEXT NOT NULL,
    "khapeetarId" TEXT NOT NULL,
    "projectTitle" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3),
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KhapeetarProfile_userId_key" ON "KhapeetarProfile"("userId");

-- AddForeignKey
ALTER TABLE "DealRequest" ADD CONSTRAINT "DealRequest_khapeetarId_fkey" FOREIGN KEY ("khapeetarId") REFERENCES "KhapeetarProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
