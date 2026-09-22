-- AlterTable
ALTER TABLE "User" ADD COLUMN "githubId" TEXT,
ADD COLUMN "githubLinkedAt" TIMESTAMP(3),
ADD COLUMN "githubLogin" TEXT;

-- CreateTable
CREATE TABLE "CourseRepository" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseRepository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRepository_userId_courseSlug_key" ON "CourseRepository"("userId", "courseSlug");

-- AddForeignKey
ALTER TABLE "CourseRepository" ADD CONSTRAINT "CourseRepository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
