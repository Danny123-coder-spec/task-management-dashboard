
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  type Task,
} from "../../store/api/tasksApi";
import { Button } from "../../components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { TaskOverviewCard } from "../../components/dashboard/TaskOverviewCard";
import { MyWorkCard } from "../../components/dashboard/MyWorkCard";
import { TaskFormDialog } from "../../components/dashboard/TaskFormDialog";
import { RecentTasksCard } from "../../components/dashboard/RecentTasksCard";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

type EditTaskState = {
  open: boolean;
  task: Task | null;
};

type TaskFormValues = {
  todo: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
};

const getTaskStatus = (task: Task): "todo" | "in-progress" | "done" => {
  if (task.status) return task.status;
  return task.completed ? "done" : "todo";
};

function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const filterStatus = useSelector((state: RootState) => state.filter.status);
  const searchQuery = useSelector((state: RootState) => state.filter.searchQuery);

  const { data, isLoading, error } = useGetTasksQuery({ userId: user?.id });
  const [addTodo, { isLoading: isAdding }] = useCreateTaskMutation();
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [open, setOpen] = useState(false);
  const [editState, setEditState] = useState<EditTaskState>({
    open: false,
    task: null,
  });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Filter tasks based on current filter status and search query
  const filteredTasks =
    data?.todos?.filter((task: Task) => {
      const matchesSearch = task.todo
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const taskStatus = getTaskStatus(task);

      if (filterStatus === "all") return matchesSearch;
      if (filterStatus === "todo")
        return matchesSearch && taskStatus === "todo";
      if (filterStatus === "in-progress")
        return matchesSearch && taskStatus === "in-progress";
      if (filterStatus === "done")
        return matchesSearch && taskStatus === "done";

      return matchesSearch;
    }) || [];

  const recentTasks = filteredTasks.slice(0, 5);
  const todoTasks = filteredTasks
    .filter((task: Task) => getTaskStatus(task) === "todo")
    .slice(0, 10);
  const inProgressTasks = filteredTasks
    .filter((task: Task) => getTaskStatus(task) === "in-progress")
    .slice(0, 10);
  const doneTasks = filteredTasks
    .filter((task: Task) => getTaskStatus(task) === "done")
    .slice(0, 10);

  const handleAddTask = async (values: TaskFormValues) => {
    try {
      await addTodo({
        todo: values.todo,
        completed: values.status === "done",
        status: values.status,
        userId: user?.id || 1,
      }).unwrap();

      setOpen(false);
      toast.success("Task created successfully!", {
        description: `"${values.todo}" has been added to your tasks.`,
      });
    } catch (error: any) {
      console.error("Create task error:", error);
      toast.error("Failed to create task", {
        description: error?.data?.message || "Please try again later.",
      });
    }
  };

  const handleEditTask = async (values: TaskFormValues) => {
    if (!editState.task) return;

    try {
      await updateTodo({
        id: editState.task.id,
        todo: values.todo,
        status: values.status,
      }).unwrap();

      setEditState({ open: false, task: null });
      toast.success("Task updated successfully!", {
        description: `"${values.todo}" has been updated.`,
      });
    } catch (error: any) {
      console.error("Update task error:", error);
      toast.error("Failed to update task", {
        description: error?.data?.message || "Please try again later.",
      });
    }
  };

  const openEdit = (task: Task) => {
    setEditState({ open: true, task });
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    try {
      await deleteTodo(deleteId).unwrap();
      setDeleteId(null);
      toast.success("Task deleted successfully!", {
        description: "The task has been removed from your list.",
      });
    } catch (error: any) {
      console.error("Delete task error:", error);
      toast.error("Failed to delete task", {
        description: error?.data?.message || "Please try again later.",
      });
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <p className="text-red-500 mb-4">Error loading tasks</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <DashboardHeader onAddTask={() => setOpen(true)} />

      <div className="flex flex-col gap-6">
        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTasksCard
            tasks={recentTasks}
            isLoading={isLoading}
            onAddTask={() => setOpen(true)}
          />
          <TaskOverviewCard
            todoCount={todoTasks.length}
            inProgressCount={inProgressTasks.length}
            doneCount={doneTasks.length}
          />
        </div>

        {/* My Work Section */}
        <MyWorkCard
          todoTasks={todoTasks}
          inProgressTasks={inProgressTasks}
          doneTasks={doneTasks}
          isLoading={isLoading}
          onEdit={openEdit}
          onDelete={setDeleteId}
        />
      </div>

      {/* Add Task Dialog */}
      <TaskFormDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleAddTask}
        isLoading={isAdding}
        title="Add New Task"
      />

      {/* Edit Task Dialog */}
      <TaskFormDialog
        open={editState.open}
        onOpenChange={(open) => setEditState({ open, task: open ? editState.task : null })}
        task={editState.task}
        onSubmit={handleEditTask}
        isLoading={isUpdating}
        title="Edit Task"
      />

      {/* Delete Task AlertDialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => setDeleteId(v ? deleteId : null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Task"}
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}