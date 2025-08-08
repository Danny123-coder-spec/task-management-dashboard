import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useMatchRoute } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  LogOut,
  Home,
  CheckCircle,
  Clock,
  Folder,
  FolderOpen,
  X,
  User,
} from "lucide-react";
import { useGetTasksQuery } from "../store/api/tasksApi";
import { type RootState } from "../store";
import { logout } from "../store/slices/authSlice";
import type { Task } from "../store/api/tasksApi";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const user = useSelector((state: RootState) => state.auth.user);
  const { data: tasksData, isLoading } = useGetTasksQuery({ userId: user?.id });

  const todoTasks =
    tasksData?.todos?.filter((task: Task) => !task.completed) || [];
  const completedTasks =
    tasksData?.todos?.filter((task: Task) => task.completed) || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate({ to: "/login" });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64",
          "flex flex-col border-r border-border/50",
          "bg-card/95 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out",
          "lg:translate-x-0 card-shadow",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 lg:hidden text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* User Profile Section */}
        <div className="px-4 py-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <nav className="p-4 space-y-6">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start hover:bg-accent hover:text-accent-foreground",
                  matchRoute({ to: "/" }) && "bg-accent text-accent-foreground"
                )}
                asChild
              >
                <Link to="/" onClick={onClose}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            </div>

            {/* Tasks Sections */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    Active Tasks
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {todoTasks.length}
                  </span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {isLoading ? (
                    <div className="px-2 py-8 text-center">
                      <div className="animate-spin h-4 w-4 border-2 border-[#5C47CD] border-t-transparent rounded-full mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        Loading tasks...
                      </p>
                    </div>
                  ) : todoTasks.length > 0 ? (
                    todoTasks.map((task) => (
                      <Button
                        key={task.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-2 py-1.5 text-sm group transition-colors",
                          matchRoute({
                            to: "/task/$taskId",
                            params: { taskId: task.id.toString() },
                          })
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/5"
                        )}
                        asChild
                      >
                        <Link
                          to="/task/$taskId"
                          params={{ taskId: task.id.toString() }}
                          onClick={onClose}
                          className="flex items-center gap-2 w-full"
                        >
                          <Clock className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="truncate flex-1">{task.todo}</span>
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <div className="px-2 py-3 text-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        No active tasks
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Tasks */}
              <div>
                <div className="flex items-center justify-between mb-2 px-2">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-green-500" />
                    Completed
                  </h3>
                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
                    {completedTasks.length}
                  </span>
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task: Task) => (
                      <Button
                        key={task.id}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-2 py-1.5 text-sm group transition-colors",
                          matchRoute({
                            to: "/task/$taskId",
                            params: { taskId: task.id.toString() },
                          })
                            ? "bg-green-500/10 text-green-500"
                            : "hover:bg-green-500/5"
                        )}
                        asChild
                      >
                        <Link
                          to="/task/$taskId"
                          params={{ taskId: task.id.toString() }}
                          onClick={onClose}
                          className="flex items-center gap-2 w-full"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="truncate flex-1 text-muted-foreground line-through">
                            {task.todo}
                          </span>
                        </Link>
                      </Button>
                    ))
                  ) : (
                    <div className="px-2 py-2">
                      <p className="text-xs text-muted-foreground">
                        No completed tasks
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-border/50 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
};
