-- CreateEnum
CREATE TYPE "HomeworkReviewStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- AlterTable
ALTER TABLE "CourseHomeworkSubmission" ADD COLUMN "status" "HomeworkReviewStatus" NOT NULL DEFAULT 'pending';
ALTER TABLE "CourseHomeworkSubmission" ADD COLUMN "reviewedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "CourseHomeworkSubmission_mentorId_status_idx" ON "CourseHomeworkSubmission"("mentorId", "status");
