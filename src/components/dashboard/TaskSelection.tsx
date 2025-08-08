import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { type Task } from "../../store/api/tasksApi";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  badgeVariant?: "default" | "secondary" | "yellow";
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  emptyMessage: string;
}

export function TaskSection({
  title,
  tasks,
  badgeVariant = "secondary",
  onEdit,
  onDelete,
  emptyMessage,
}: TaskSectionProps) {
  const getBadgeClassName = () => {
    if (badgeVariant === "yellow") {
      return "text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
    return "text-xs";
  };

  const getTaskClassName = (_task: Task) => {
    if (badgeVariant === "yellow") {
      return "flex items-center justify-between p-2 rounded bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-800/30";
    }
    if (badgeVariant === "default") {
      return "flex items-center justify-between p-2 rounded bg-muted/30";
    }
    return "flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors";
  };

  const getTextClassName = (_task: Task) => {
    if (badgeVariant === "yellow") {
      return "text-sm truncate flex-1 pr-2 text-yellow-800 dark:text-yellow-200";
    }
    if (badgeVariant === "default") {
      return "text-sm line-through text-muted-foreground truncate flex-1 pr-2";
    }
    return "text-sm truncate flex-1 pr-2";
  };

  return (
    <div>
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <span>{title}</span>
        <Badge
          variant={badgeVariant === "yellow" ? "secondary" : badgeVariant}
          className={getBadgeClassName()}
        >
          {tasks.length}
        </Badge>
      </h3>
      <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
        {tasks.length > 0 ? (
          tasks.map((task: Task) => (
            <div key={task.id} className={getTaskClassName(task)}>
              <span className={getTextClassName(task)} title={task.todo}>
                {task.todo}
              </span>
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs cursor-pointer"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-red-600"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground text-sm py-4">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
