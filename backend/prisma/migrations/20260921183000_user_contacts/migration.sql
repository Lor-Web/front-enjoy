ALTER TABLE "User" ADD COLUMN "contacts" JSONB NOT NULL DEFAULT '{}';

UPDATE "User"
SET "contacts" = jsonb_build_object('telegram', "telegramUrl")
WHERE "telegramUrl" IS NOT NULL AND "telegramUrl" <> '';

ALTER TABLE "User" DROP COLUMN "telegramUrl";
