import { Clock, List, Plus } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { type Task } from "../../store/api/tasksApi";
import { Link } from "@tanstack/react-router";

interface RecentTasksCardProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: () => void;
}

export function RecentTasksCard({
  tasks,
  isLoading,
  onAddTask,
}: RecentTasksCardProps) {
  const getTaskStatus = (task: Task): "todo" | "in-progress" | "done" => {
    if (task.status) return task.status;
    return task.completed ? "done" : "todo";
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recent Tasks</h2>
        <Badge variant="secondary" className="ml-auto text-xs">
          {tasks.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task: Task) => {
            const taskStatus = getTaskStatus(task);
            return (
              <Link
                to="/task/$taskId"
                params={{ taskId: task.id.toString() }}
                key={task.id}
                className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <List className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm truncate" title={task.todo}>
                    {task.todo}
                  </span>
                </div>
                <Badge
                  variant={taskStatus === "done" ? "default" : "secondary"}
                  className={`text-xs flex-shrink-0 ml-2 ${
                    taskStatus === "in-progress"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                      : ""
                  }`}
                >
                  {taskStatus === "done"
                    ? "Done"
                    : taskStatus === "in-progress"
                    ? "In Progress"
                    : "To Do"}
                </Badge>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-8">
            <List className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm mb-2">No tasks found</p>
            <Button size="sm" variant="outline" onClick={onAddTask}>
              <Plus className="h-3 w-3 mr-1" />
              Add your first task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
