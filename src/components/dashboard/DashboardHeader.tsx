import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import {
  setStatusFilter,
  type TaskStatus,
} from "../../store/slices/filterSlice";
import { Button } from "../ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { Plus } from "lucide-react";

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

interface DashboardHeaderProps {
  onAddTask: () => void;
}

export function DashboardHeader({ onAddTask }: DashboardHeaderProps) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const filterStatus = useSelector((state: RootState) => state.filter.status);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="lg:text-3xl md:text-2xl text-xl font-bold mb-2">
          {getGreeting()}, {user?.firstName || "User"}!
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={filterStatus}
          onValueChange={(value) =>
            dispatch(setStatusFilter(value as TaskStatus))
          }
        >
          <SelectTrigger className="w-[140px] cursor-pointer">
            <SelectValue>
              {statusOptions.find((opt) => opt.value === filterStatus)?.label ||
                "All Tasks"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          className="flex items-center cursor-pointer gap-2"
          onClick={onAddTask}
        >
          <Plus className="h-5 w-5" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
