import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../ui/select";
import { type Task } from "../../store/api/tasksApi";

const statusOptions: {
  label: string;
  value: "todo" | "in-progress" | "done";
}[] = [
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

const taskSchema = z.object({
  todo: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(200, "Description max 200 characters").optional(),
  status: z.enum(["todo", "in-progress", "done"], {
    message: "Status is required",
  }),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  isLoading: boolean;
  title: string;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
  isLoading,
  title,
}: TaskFormDialogProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      todo: task?.todo || "",
      description: "",
      status: task?.status || "todo",
    },
  });

  const handleSubmit = (values: TaskFormValues) => {
    onSubmit(values);
    if (!task) {
      form.reset({ status: "todo", description: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle>{title}</DialogTitle>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="todo" className="mb-3.5">
              Title *
            </Label>
            <Input
              id="todo"
              placeholder="Enter task title..."
              {...form.register("todo")}
            />
            {form.formState.errors.todo && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.todo.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className="mb-3.5">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description..."
              rows={3}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="status" className="mb-3.5">
              Status *
            </Label>
            <Select
              value={form.watch("status")}
              onValueChange={(v) =>
                form.setValue("status", v as "todo" | "in-progress" | "done")
              }
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue>
                  {statusOptions.find(
                    (opt) => opt.value === form.watch("status")
                  )?.label || "Select status"}
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
            {form.formState.errors.status && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading
                ? task
                  ? "Saving..."
                  : "Adding..."
                : task
                ? "Save Changes"
                : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
