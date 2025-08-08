
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGetTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '../../../store/api/tasksApi'
import { useSelector } from 'react-redux'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectSeparator, SelectValue } from '../../../components/ui/select'
import { ArrowLeft, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Dialog, DialogTrigger, DialogHeader, DialogClose, DialogFooter, DialogContent, DialogTitle } from '../../../components/ui/dialog'
import { Button } from '../../../components/ui/button'
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '../../../components/ui/alert-dialog'
import type { RootState } from '../../../store'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_authenticated/task/$taskId')({
  component: TaskDetail,
})

interface Task {
  id: number
  todo: string
  completed: boolean
  status?: 'todo' | 'in-progress' | 'done'
  userId: number
}

// function to get tasks statuses
const getTaskStatus = (task: Task): 'todo' | 'in-progress' | 'done' => {
  if (task.status) return task.status
  return task.completed ? 'done' : 'todo'
}

function TaskDetail() {
  const { taskId } = Route.useParams()
  const navigate = useNavigate()
  
  const user = useSelector((state: RootState) => state.auth.user)
  
  const { data, isLoading, error } = useGetTasksQuery({ userId: user?.id })
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation()
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation()
  
  const task = data?.todos?.find((t: Task) => t.id === parseInt(taskId))
  const taskStatus = task ? getTaskStatus(task) : 'todo'

  const handleToggleComplete = async () => {
    if (!task) return
    
    try {
      const newStatus = taskStatus === 'done' ? 'todo' : 'done'
      await updateTask({
        id: task.id,
        status: newStatus,
      }).unwrap()
      
      toast.success('Task updated successfully!', { 
        description: `Task marked as ${newStatus === 'done' ? 'completed' : 'to do'}` 
      })
    } catch (error: any) {
      console.error('Update task error:', error)
      toast.error('Failed to update task', {
        description: error?.data?.message || 'Please try again later.'
      })
    }
  }

  const handleDelete = async () => {
    if (!task) return
    
    try {
      await deleteTask(task.id).unwrap()
      toast.success('Task deleted successfully!', {
        description: 'Redirecting to dashboard...'
      })
      navigate({ to: '/' })
    } catch (error: any) {
      console.error('Delete task error:', error)
      toast.error('Failed to delete task', {
        description: error?.data?.message || 'Please try again later.'
      })
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return
    
    const status = newStatus.toLowerCase().replace('_', '-') as 'todo' | 'in-progress' | 'done'
    
    try {
      await updateTask({
        id: task.id,
        status: status,
      }).unwrap()
      
      toast.success('Status updated successfully!')
    } catch (error: any) {
      console.error('Update status error:', error)
      toast.error('Failed to update status')
    }
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-start justify-center bg-background py-10 px-2">
        <div className="w-full max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-6"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="w-full min-h-screen flex items-start justify-center bg-background py-10 px-2">
        <div className="w-full max-w-4xl text-center py-16">
          <h1 className="text-2xl font-bold text-foreground mb-4">Task not found</h1>
          <Button onClick={() => navigate({ to: '/' })} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex items-start justify-center rounded-lg px-2 bg-background">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate({ to: '/' })} 
            className="rounded-full p-2 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-lg font-semibold text-foreground">Task Details</span>
        </div>

       
        <div className="rounded-xl bg-card border shadow-lg p-0 w-full">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              
              <Select
                value={taskStatus === 'todo' ? 'TO_DO' : taskStatus === 'in-progress' ? 'IN_PROGRESS' : 'COMPLETE'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger
                  className={`px-3 py-1 rounded-full cursor-pointer text-xs font-semibold border focus:ring-2 focus:ring-primary/80 transition min-w-[90px] h-auto
                    ${taskStatus === 'done' ? 'bg-green-100 dark:bg-green-900/60 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' : 
                      taskStatus === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' : 
                      'bg-muted text-muted-foreground border-border'}`}
                >
                  <SelectValue>
                    {taskStatus === 'done' ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-400" /> COMPLETE
                      </span>
                    ) : taskStatus === 'in-progress' ? (
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-yellow-400" /> IN PROGRESS
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-zinc-400" /> TO DO
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-popover border text-popover-foreground w-56 p-0">
                  <div className="px-3 pt-2 pb-1 text-xs text-muted-foreground font-bold">Not started</div>
                  <SelectItem value="TO_DO" className="flex items-center gap-2 px-3 py-2">
                    <Clock className="h-4 w-4 text-zinc-400" /> TO DO
                  </SelectItem>
                  <SelectSeparator className="bg-border" />
                  <div className="px-3 pt-2 pb-1 text-xs text-muted-foreground font-bold">Active</div>
                  <SelectItem value="IN_PROGRESS" className="flex items-center gap-2 px-3 py-2">
                    <AlertCircle className="h-4 w-4 text-yellow-400" /> IN PROGRESS
                  </SelectItem>
                  <SelectItem value="COMPLETE" className="flex items-center gap-2 px-3 py-2">
                    <CheckCircle className="h-4 w-4 text-green-400" /> COMPLETE
                  </SelectItem>
                </SelectContent>
              </Select>
              {/* Task ID */}
              <span className="ml-2 text-xs text-zinc-500 font-mono">#{task.id}</span>
            </div>
            <div className="flex items-center gap-2">
              {/*Used to Mark as Complete/ In Progress /To Do Button */}
              <Button
                onClick={handleToggleComplete}
                disabled={isUpdating}
                size="sm"
                variant={taskStatus === 'done' ? 'outline' : 'default'}
                className="rounded-full cursor-pointer px-4 py-1 text-xs font-semibold"
              >
                {isUpdating
                  ? 'Updating...'
                  : taskStatus === 'done'
                  ? 'Mark as To Do'
                  : 'Mark as Complete'}
              </Button>

              {/* Edit Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full cursor-pointer">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-background">
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const todoInput = form.elements.namedItem('todo') as HTMLInputElement;
                      const newTitle = todoInput.value;
                      try {
                        await updateTask({ id: task.id, todo: newTitle }).unwrap();
                        toast.success('Task updated!');
                      } catch (error: any) {
                        toast.error('Failed to update task');
                      }
                    }}
                  >
                    <Input
                      name="todo"
                      defaultValue={task.todo}
                      autoFocus
                    />
                    <DialogFooter className='mt-4'>
                      <Button type="submit">Save</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline" className='cursor-pointer'>Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {/* Delete Alert Dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="rounded-full cursor-pointer" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#18181b] border border-zinc-700">
                  <DialogHeader>
                    <AlertDialogTitle className="text-white">Delete Task</AlertDialogTitle>
                  </DialogHeader>
                  <p className="text-foreground mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
                  <DialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogAction>
                  </DialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Task Title */}
          <div className="px-6 pt-6 pb-2">
            <h1 className="text-2xl font-bold text-foreground mb-2 leading-tight">{task.todo}</h1>
          </div>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-6 px-6 pb-6">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Status</span>
              <span className={`mt-1 text-sm font-medium ${
                taskStatus === 'done' ? 'text-green-600 dark:text-green-400' : 
                taskStatus === 'in-progress' ? 'text-yellow-600 dark:text-yellow-400' : 
                'text-muted-foreground'
              }`}>
                {taskStatus === 'done' ? 'Complete' : taskStatus === 'in-progress' ? 'In Progress' : 'To Do'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Task ID</span>
              <span className="mt-1 text-sm font-mono text-muted-foreground">#{task.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">User ID</span>
              <span className="mt-1 text-sm font-mono text-muted-foreground">{task.userId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
