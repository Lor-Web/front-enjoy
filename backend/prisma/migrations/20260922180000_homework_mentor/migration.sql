-- AlterTable
ALTER TABLE "CourseHomeworkSubmission" ADD COLUMN "mentorId" TEXT;

-- AddForeignKey
ALTER TABLE "CourseHomeworkSubmission" ADD CONSTRAINT "CourseHomeworkSubmission_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
