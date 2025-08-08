import { User } from "lucide-react";

import { type Task } from "../../store/api/tasksApi";
import { TaskSection } from "./TaskSelection";

interface MyWorkCardProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function MyWorkCard({
  todoTasks,
  inProgressTasks,
  doneTasks,
  isLoading,
  onEdit,
  onDelete,
}: MyWorkCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">My Work</h2>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        ) : (
          <>
            <TaskSection
              title="To Do"
              tasks={todoTasks}
              badgeVariant="secondary"
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage="No to do tasks"
            />

            <TaskSection
              title="In Progress"
              tasks={inProgressTasks}
              badgeVariant="yellow"
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage="No tasks in progress"
            />

            <TaskSection
              title="Completed"
              tasks={doneTasks}
              badgeVariant="default"
              onEdit={onEdit}
              onDelete={onDelete}
              emptyMessage="No completed tasks"
            />
          </>
        )}
      </div>
    </div>
  );
}
