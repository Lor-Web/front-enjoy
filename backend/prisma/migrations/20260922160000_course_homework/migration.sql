-- CreateTable
CREATE TABLE "CourseHomeworkSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "moduleSlug" TEXT NOT NULL,
    "prUrl" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseHomeworkSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseHomeworkSubmission_userId_courseSlug_moduleSlug_key" ON "CourseHomeworkSubmission"("userId", "courseSlug", "moduleSlug");

-- AddForeignKey
ALTER TABLE "CourseHomeworkSubmission" ADD CONSTRAINT "CourseHomeworkSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
