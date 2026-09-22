-- CreateEnum
CREATE TYPE "ContentVoteValue" AS ENUM ('up', 'down');

-- CreateTable
CREATE TABLE "ContentVote" (
    "id" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "voterKey" TEXT NOT NULL,
    "vote" "ContentVoteValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentVote_targetId_voterKey_key" ON "ContentVote"("targetId", "voterKey");

-- CreateIndex
CREATE INDEX "ContentVote_targetId_idx" ON "ContentVote"("targetId");
