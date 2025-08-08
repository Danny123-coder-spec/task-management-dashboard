import { CheckCircle } from "lucide-react";


interface TaskOverviewCardProps {
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

export function TaskOverviewCard({ todoCount, inProgressCount, doneCount }: TaskOverviewCardProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold mb-1 text-blue-600">{todoCount}</div>
          <div className="text-xs text-muted-foreground">To Do</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/30">
          <div className="text-2xl font-bold mb-1 text-yellow-600">{inProgressCount}</div>
          <div className="text-xs text-muted-foreground">In Progress</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/30 col-span-2">
          <div className="text-2xl font-bold mb-1 text-green-600">{doneCount}</div>
          <div className="text-xs text-muted-foreground">Completed</div>
        </div>
      </div>
    </div>
  );
}
