import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from './ui/button'
import { LogOut, Home, CheckCircle, Clock, Folder, FolderOpen } from 'lucide-react'
import { useGetTasksQuery } from '../store/api/tasksApi'
import { type RootState } from '../store'
import { logout } from '../store/slices/authSlice'

export const Sidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const { data: tasksData, isLoading } = useGetTasksQuery({ userId: user?.id })

  //This will basically organized tasks by status
  const todoTasks = tasksData?.todos?.filter((task: any) => !task.completed) || []
  const completedTasks = tasksData?.todos?.filter((task: any) => task.completed) || []

  const handleLogout = () => {
    dispatch(logout())
    navigate({ to: '/login' })
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex flex-col p-4 border-r border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      {/* Main Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        <Button variant="ghost" className="justify-start" asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        {/* Tasks Section Organized by folders */}
        <div className="mt-6 space-y-4">
          {/* To Do Tasks Folder */}
          <div>
            <div className="flex items-center gap-2 px-2 mb-2">
              <Folder className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">
                To Do ({todoTasks.length})
              </h3>
            </div>
            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {isLoading ? (
                <div className="px-2 text-sm text-muted-foreground">
                  Loading tasks...
                </div>
              ) : todoTasks.length > 0 ? (
                todoTasks.map((task: any) => (
                  <Button
                    key={task.id}
                    variant="ghost"
                    className="justify-start w-full text-left h-auto py-2 px-2"
                    asChild
                  >
                    <Link
                      to="/task/$taskId"
                      params={{ taskId: task.id.toString() }}
                      className="flex items-center gap-2 w-full"
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm truncate">
                        {task.todo.length > 20
                          ? `${task.todo.substring(0, 20)}...`
                          : task.todo}
                      </span>
                    </Link>
                  </Button>
                ))
              ) : (
                <div className="px-2 py-2">
                  <p className="text-xs text-muted-foreground">
                    No tasks to do
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks Folder */}
          <div>
            <div className="flex items-center gap-2 px-2 mb-2">
              <FolderOpen className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-medium text-muted-foreground">
                Completed ({completedTasks.length})
              </h3>
            </div>
            <div className="space-y-1 custom-scrollbar pr-2">
              {completedTasks.length > 0 ? (
                completedTasks.map((task: any) => (
                  <Button
                    key={task.id}
                    variant="ghost"
                    className="justify-start w-full text-left h-auto py-2 px-2"
                    asChild
                  >
                    <Link
                      to="/task/$taskId"
                      params={{ taskId: task.id.toString() }}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-sm truncate line-through text-muted-foreground">
                          {task.todo.length > 20
                            ? `${task.todo.substring(0, 20)}...`
                            : task.todo}
                        </span>
                      </div>
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

      {/* Bottom - Logout */}
      <div className="pt-4 border-t border-border">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
