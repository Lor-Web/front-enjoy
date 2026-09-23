import { useParams } from "react-router";
import { findTask } from "@/entities/task";
import { NotFoundPage } from "@/pages/not-found";
import { Header } from "@/widgets/header";
import { TaskWorkspace } from "@/widgets/task-workspace";

export function TaskPage() {
  const { slug = "" } = useParams();
  const task = findTask(slug);

  if (!task) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden">
      <Header />
      <main id="content" className="min-h-0 flex-1">
        <TaskWorkspace task={task} />
      </main>
    </div>
  );
}
