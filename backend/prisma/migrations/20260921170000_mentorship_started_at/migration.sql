ALTER TABLE "Mentorship" ADD COLUMN "startedAt" TIMESTAMP(3);

UPDATE "Mentorship"
SET "startedAt" = "updatedAt"
WHERE "status" IN ('active', 'ended');
