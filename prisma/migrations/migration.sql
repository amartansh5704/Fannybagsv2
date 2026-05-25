-- ============================================================
-- FannyBags Escrow Migration
-- Run ONCE against local postgres, then: npx prisma generate
-- ============================================================

ALTER TABLE "DealRequest"
  ADD COLUMN IF NOT EXISTS "artistCompleted"   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "khapeetarCompleted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "escrowAmount"       DOUBLE PRECISION;

-- ============================================================
-- After running this:
--   1. Replace prisma/schema.prisma with the provided file
--   2. npx prisma generate
-- ============================================================