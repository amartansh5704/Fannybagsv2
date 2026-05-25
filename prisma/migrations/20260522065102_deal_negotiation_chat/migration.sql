-- AlterTable
ALTER TABLE "DealRequest" ADD COLUMN     "acceptedBudget" DOUBLE PRECISION,
ADD COLUMN     "counterBudget" DOUBLE PRECISION,
ADD COLUMN     "counterMessage" TEXT,
ADD COLUMN     "negotiationStage" TEXT NOT NULL DEFAULT 'artist_offer';

-- CreateTable
CREATE TABLE "DealChatRoom" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealChatRoom_dealId_key" ON "DealChatRoom"("dealId");

-- AddForeignKey
ALTER TABLE "DealChatRoom" ADD CONSTRAINT "DealChatRoom_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "DealRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "DealChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
