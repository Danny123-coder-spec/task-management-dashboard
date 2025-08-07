// import { createFileRoute } from '@tanstack/react-router'
// import { useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { type RootState } from '../../store'
// import { setStatusFilter, setSearchQuery, type TaskStatus } from '../../store/slices/filterSlice'
// import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation, type Task } from '../../store/api/tasksApi'
// import { Button } from '../../components/ui/button'
// import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '../../components/ui/dialog'
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select'
// import { Badge } from '../../components/ui/badge'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import * as z from 'zod'
// import { Input } from '../../components/ui/input'
// import { Textarea } from '../../components/ui/textarea'
// import { Label } from '../../components/ui/label'
// import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog'
// import { Clock, CheckCircle, User, Plus, List, AlertCircle } from 'lucide-react'
// import { toast } from 'sonner'

// export const Route = createFileRoute('/_authenticated/')({
//   component: Dashboard,
// })

// const statusOptions: { label: string; value: TaskStatus }[] = [
//   { label: 'All', value: 'all' },
//   { label: 'To Do', value: 'todo' },
//   { label: 'In Progress', value: 'in-progress' },
//   { label: 'Done', value: 'done' },
// ]

// const addTaskSchema = z.object({
//   todo: z.string().min(3, 'Title must be at least 3 characters'),
//   description: z.string().max(200, 'Description max 200 characters').optional(),
//   status: z.enum(['todo', 'in-progress', 'done'], { message: 'Status is required' }),
// })

// type AddTaskFormValues = z.infer<typeof addTaskSchema>

// type EditTaskState = {
//   open: boolean
//   task: Task | null
// }

// function Dashboard() {
//   const dispatch = useDispatch()
//   const user = useSelector((state: RootState) => state.auth.user)
//   const filterStatus = useSelector((state: RootState) => state.filter.status)
//   const searchQuery = useSelector((state: RootState) => state.filter.searchQuery)

//   const { data, isLoading, error } = useGetTasksQuery({ userId: user?.id })
//   const [addTodo, { isLoading: isAdding }] = useCreateTaskMutation()
//   const [updateTodo, { isLoading: isUpdating }] = useUpdateTaskMutation()
//   const [deleteTodo, { isLoading: isDeleting }] = useDeleteTaskMutation()

//   const [open, setOpen] = useState(false)
//   const [editState, setEditState] = useState<EditTaskState>({ open: false, task: null })
//   const [deleteId, setDeleteId] = useState<number | null>(null)

//   // Dynamic greeting based on time
//   const getGreeting = () => {
//     const hour = new Date().getHours()
//     if (hour < 12) return 'Good morning'
//     if (hour < 17) return 'Good afternoon'
//     if (hour < 21) return 'Good evening'
//     return 'Good night'
//   }

//   // Filter tasks based on current filter status and search query
//   const filteredTasks = data?.todos?.filter((task: Task) => {
//     const matchesSearch = task.todo.toLowerCase().includes(searchQuery.toLowerCase())

//     if (filterStatus === 'all') return matchesSearch
//     if (filterStatus === 'todo') return matchesSearch && !task.completed
//     if (filterStatus === 'in-progress') return matchesSearch && !task.completed
//     if (filterStatus === 'done') return matchesSearch && task.completed

//     return matchesSearch
//   }) || []

//   // Add Task form
//   const addForm = useForm<AddTaskFormValues>({
//     resolver: zodResolver(addTaskSchema),
//     defaultValues: {
//       status: 'todo',
//       description: ''
//     },
//   })

//   const onAddSubmit = async (values: AddTaskFormValues) => {
//     try {
//       const result = await addTodo({
//         todo: values.todo,
//         completed: values.status === 'done',
//         userId: user?.id || 1
//       }).unwrap()

//       setOpen(false)
//       addForm.reset({ status: 'todo', description: '' })

//       toast.success('Task created successfully!', {
//         description: `"${values.todo}" has been added to your tasks.`
//       })
//     } catch (error: any) {
//       console.error('Create task error:', error)
//       toast.error('Failed to create task', {
//         description: error?.data?.message || 'Please try again later.'
//       })
//     }
//   }

//   // Edit Task form
//   const editForm = useForm<AddTaskFormValues>({
//     resolver: zodResolver(addTaskSchema),
//     defaultValues: { status: 'todo' },
//   })

//   const openEdit = (task: Task) => {
//     setEditState({ open: true, task })
//     editForm.reset({
//       todo: task.todo,
//       description: '',
//       status: task.completed ? 'done' : 'todo',
//     })
//   }

//   const onEditSubmit = async (values: AddTaskFormValues) => {
//     if (!editState.task) return

//     try {
//       await updateTodo({
//         id: editState.task.id,
//         todo: values.todo,
//         completed: values.status === 'done',
//       }).unwrap()

//       setEditState({ open: false, task: null })

//       toast.success('Task updated successfully!', {
//         description: `"${values.todo}" has been updated.`
//       })
//     } catch (error: any) {
//       console.error('Update task error:', error)
//       toast.error('Failed to update task', {
//         description: error?.data?.message || 'Please try again later.'
//       })
//     }
//   }

//   const onDelete = async () => {
//     if (deleteId == null) return

//     try {
//       await deleteTodo(deleteId).unwrap()
//       setDeleteId(null)

//       toast.success('Task deleted successfully!', {
//         description: 'The task has been removed from your list.'
//       })
//     } catch (error: any) {
//       console.error('Delete task error:', error)
//       toast.error('Failed to delete task', {
//         description: error?.data?.message || 'Please try again later.'
//       })
//     }
//   }

//   // Derived data for different sections
//   const recentTasks = filteredTasks.slice(0, 5)
//   const todoTasks = filteredTasks.filter((task: Task) => !task.completed).slice(0, 10)
//   const doneTasks = filteredTasks.filter((task: Task) => task.completed).slice(0, 10)

//   if (error) {
//     return (
//       <div className="text-center py-8">
//         <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
//         <p className="text-red-500 mb-4">Error loading tasks</p>
//         <Button onClick={() => window.location.reload()}>
//           Retry
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-7xl mx-auto">
//       {/* Header Section */}
//       <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {user?.firstName || 'User'}!</h1>
//           <p className="text-muted-foreground">Here's what's happening with your tasks today.</p>
//         </div>

//         {/* Filter Controls */}
//         <div className="flex items-center gap-4">
//           <Select
//             value={filterStatus}
//             onValueChange={(value) => dispatch(setStatusFilter(value as TaskStatus))}
//           >
//             <SelectTrigger className="w-[140px] cursor-pointer">
//               <SelectValue>
//                 {statusOptions.find(opt => opt.value === filterStatus)?.label || 'All Tasks'}
//               </SelectValue>
//             </SelectTrigger>
//             <SelectContent>
//               {statusOptions.map(opt => (
//                 <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//               <Button size="lg" className="flex items-center cursor-pointer gap-2">
//                 <Plus className="h-5 w-5" />
//                 Add Task
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-md">
//               <DialogTitle>Add New Task</DialogTitle>
//               <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
//                 <div>
//                   <Label htmlFor="todo" className='mb-3.5'>Title *</Label>
//                   <Input
//                     id="todo"
//                     placeholder="Enter task title..."
//                     {...addForm.register('todo')}
//                   />
//                   {addForm.formState.errors.todo && (
//                     <p className="text-red-500 text-xs mt-1">{addForm.formState.errors.todo.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="description" className='mb-3.5'>Description</Label>
//                   <Textarea
//                     id="description"
//                     placeholder="Optional description..."
//                     rows={3}
//                     {...addForm.register('description')}
//                   />
//                   {addForm.formState.errors.description && (
//                     <p className="text-red-500 text-xs mt-1">{addForm.formState.errors.description.message}</p>
//                   )}
//                 </div>

//                 <div>
//                   <Label htmlFor="status" className='mb-3.5'>Status *</Label>
//                   <Select
//                     value={addForm.watch('status')}
//                     onValueChange={(v) => addForm.setValue('status', v as "todo" | "in-progress" | "done")}
//                   >
//                     <SelectTrigger id="status" className="w-full">
//                       <SelectValue>
//                         {statusOptions.find(opt => opt.value === addForm.watch('status'))?.label || 'Select status'}
//                       </SelectValue>
//                     </SelectTrigger>
//                     <SelectContent>
//                       {statusOptions.filter(opt => opt.value !== 'all').map(opt => (
//                         <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {addForm.formState.errors.status && (
//                     <p className="text-red-500 text-xs mt-1">{addForm.formState.errors.status.message}</p>
//                   )}
//                 </div>

//                 <div className="flex gap-2 pt-2">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() => setOpen(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button type="submit" className="flex-1 cursor-pointer" disabled={isAdding}>
//                     {isAdding ? 'Adding...' : 'Add Task'}
//                   </Button>
//                 </div>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Main Dashboard Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//         {/* Recent Tasks */}
//         <div className="bg-card rounded-lg border p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Clock className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-semibold">Recent Tasks</h2>
//             <Badge variant="secondary" className="ml-auto text-xs">
//               {recentTasks.length}
//             </Badge>
//           </div>

//           <div className="space-y-3">
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                 <p className="text-muted-foreground text-sm">Loading tasks...</p>
//               </div>
//             ) : recentTasks.length > 0 ? (
//               recentTasks.map((task: Task) => (
//                 <div key={task.id} className="flex items-center justify-between p-3 rounded-md bg-muted/50 hover:bg-muted/80 transition-colors">
//                   <div className="flex items-center gap-3 flex-1 min-w-0">
//                     <List className="h-4 w-4 text-muted-foreground flex-shrink-0" />
//                     <span className="text-sm truncate" title={task.todo}>
//                       {task.todo}
//                     </span>
//                   </div>
//                   <Badge
//                     variant={task.completed ? 'default' : 'secondary'}
//                     className="text-xs flex-shrink-0 ml-2"
//                   >
//                     {task.completed ? 'Done' : 'Pending'}
//                   </Badge>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <List className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
//                 <p className="text-muted-foreground text-sm mb-2">No tasks found</p>
//                 <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
//                   <Plus className="h-3 w-3 mr-1" />
//                   Add your first task
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Task Overview Stats */}
//         <div className="bg-card rounded-lg border p-6">
//           <div className="flex items-center gap-2 mb-4">
//             <CheckCircle className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-semibold">Overview</h2>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="text-center p-4 rounded-lg bg-muted/30">
//               <div className="text-2xl font-bold mb-1 text-orange-600">
//                 {todoTasks.length}
//               </div>
//               <div className="text-xs text-muted-foreground">To Do</div>
//             </div>
//             <div className="text-center p-4 rounded-lg bg-muted/30">
//               <div className="text-2xl font-bold mb-1 text-green-600">
//                 {doneTasks.length}
//               </div>
//               <div className="text-xs text-muted-foreground">Completed</div>
//             </div>
//             <div className="text-center p-4 rounded-lg bg-muted/30 col-span-2">
//               <div className="text-2xl font-bold mb-1 text-blue-600">
//                 {filteredTasks.length}
//               </div>
//               <div className="text-xs text-muted-foreground">
//                 Total ({filterStatus === 'all' ? 'All' : statusOptions.find(s => s.value === filterStatus)?.label})
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* My Work Section */}
//         <div className="bg-card rounded-lg border p-6 lg:col-span-2 xl:col-span-1">
//           <div className="flex items-center gap-2 mb-4">
//             <User className="h-5 w-5 text-muted-foreground" />
//             <h2 className="text-lg font-semibold">My Work</h2>
//           </div>

//           <div className="space-y-6">
//             {isLoading ? (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
//                 <p className="text-muted-foreground text-sm">Loading...</p>
//               </div>
//             ) : (
//               <>
//                 {/* To Do Tasks */}
//                 <div>
//                   <h3 className="font-medium mb-3 flex items-center gap-2">
//                     <span>To Do</span>
//                     <Badge variant="secondary" className="text-xs">
//                       {todoTasks.length}
//                     </Badge>
//                   </h3>
//                   <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
//                     {todoTasks.length > 0 ? (
//                       todoTasks.map((task: Task) => (
//                         <div key={task.id} className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors">
//                           <span className="text-sm truncate flex-1 pr-2" title={task.todo}>
//                             {task.todo}
//                           </span>
//                           <div className="flex gap-1 flex-shrink-0">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-7 px-2 text-xs"
//                               onClick={() => openEdit(task)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-7 px-2 text-xs text-red-600"
//                               onClick={() => setDeleteId(task.id)}
//                             >
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-center text-muted-foreground text-sm py-4">
//                         No pending tasks
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Done Tasks */}
//                 <div>
//                   <h3 className="font-medium mb-3 flex items-center gap-2">
//                     <span>Completed</span>
//                     <Badge variant="default" className="text-xs">
//                       {doneTasks.length}
//                     </Badge>
//                   </h3>
//                   <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
//                     {doneTasks.length > 0 ? (
//                       doneTasks.map((task: Task) => (
//                         <div key={task.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
//                           <span className="text-sm line-through text-muted-foreground truncate flex-1 pr-2" title={task.todo}>
//                             {task.todo}
//                           </span>
//                           <div className="flex gap-1 flex-shrink-0">
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-7 px-2 text-xs"
//                               onClick={() => openEdit(task)}
//                             >
//                               Edit
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               className="h-7 px-2 text-xs text-red-600"
//                               onClick={() => setDeleteId(task.id)}
//                             >
//                               Delete
//                             </Button>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-center text-muted-foreground text-sm py-4">
//                         No completed tasks
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Edit Task Dialog */}
//       <Dialog open={editState.open} onOpenChange={(v: boolean) => setEditState({ open: v, task: v ? editState.task : null })}>
//         <DialogContent className="max-w-md">
//           <DialogTitle>Edit Task</DialogTitle>
//           <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
//             <div>
//               <Label htmlFor="edit-todo" className='mb-3.5'>Title *</Label>
//               <Input
//                 id="edit-todo"
//                 placeholder="Enter task title..."
//                 {...editForm.register('todo')}
//               />
//               {editForm.formState.errors.todo && (
//                 <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.todo.message}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="edit-description" className='mb-3.5'>Description</Label>
//               <Textarea
//                 id="edit-description"
//                 placeholder="Optional description..."
//                 rows={3}
//                 {...editForm.register('description')}
//               />
//               {editForm.formState.errors.description && (
//                 <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.description.message}</p>
//               )}
//             </div>

//             <div>
//               <Label htmlFor="edit-status" className='mb-3.5'>Status *</Label>
//               <Select
//                 value={editForm.watch('status')}
//                 onValueChange={(v) => editForm.setValue('status', v as "todo" | "in-progress" | "done")}
//               >
//                 <SelectTrigger id="edit-status" className="w-full">
//                   <SelectValue>
//                     {statusOptions.find(opt => opt.value === editForm.watch('status'))?.label || 'Select status'}
//                   </SelectValue>
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statusOptions.filter(opt => opt.value !== 'all').map(opt => (
//                     <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {editForm.formState.errors.status && (
//                 <p className="text-red-500 text-xs mt-1">{editForm.formState.errors.status.message}</p>
//               )}
//             </div>

//             <div className="flex gap-2 pt-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="flex-1 cursor-pointer"
//                 onClick={() => setEditState({ open: false, task: null })}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" className="flex-1 cursor-pointer" disabled={isUpdating}>
//                 {isUpdating ? 'Saving...' : 'Save Changes'}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Delete Task AlertDialog */}
//       <AlertDialog open={deleteId !== null} onOpenChange={(v) => setDeleteId(v ? deleteId : null)}>
//         <AlertDialogContent>
//           <AlertDialogTitle>Delete Task</AlertDialogTitle>
//           <p className="text-sm text-muted-foreground mb-4">
//             Are you sure you want to delete this task? This action cannot be undone.
//           </p>
//           <div className="flex gap-2">
//             <AlertDialogCancel asChild>
//               <Button variant="outline" className="flex-1">Cancel</Button>
//             </AlertDialogCancel>
//             <AlertDialogAction asChild>
//               <Button
//                 variant="destructive"
//                 className="flex-1"
//                 onClick={onDelete}
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? 'Deleting...' : 'Delete Task'}
//               </Button>
//             </AlertDialogAction>
//           </div>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   )
// }

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../../store";
import {
  setStatusFilter,
  setSearchQuery,
  type TaskStatus,
} from "../../store/slices/filterSlice";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  type Task,
} from "../../store/api/tasksApi";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import {
  Clock,
  CheckCircle,
  User,
  Plus,
  List,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  component: Dashboard,
});

const statusOptions: { label: string; value: TaskStatus }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in-progress" },
  { label: "Done", value: "done" },
];

const addTaskSchema = z.object({
  todo: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().max(200, "Description max 200 characters").optional(),
  status: z.enum(["todo", "in-progress", "done"], {
    message: "Status is required",
  }),
});

type AddTaskFormValues = z.infer<typeof addTaskSchema>;

type EditTaskState = {
  open: boolean;
  task: Task | null;
};

// Helper function to get task status
const getTaskStatus = (task: Task): "todo" | "in-progress" | "done" => {
  if (task.status) return task.status;
  return task.completed ? "done" : "todo";
};

function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const filterStatus = useSelector((state: RootState) => state.filter.status);
  const searchQuery = useSelector(
    (state: RootState) => state.filter.searchQuery
  );

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

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

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

  // Add Task form
  const addForm = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      status: "todo",
      description: "",
    },
  });

  const onAddSubmit = async (values: AddTaskFormValues) => {
    try {
      const result = await addTodo({
        todo: values.todo,
        completed: values.status === "done",
        status: values.status,
        userId: user?.id || 1,
      }).unwrap();

      setOpen(false);
      addForm.reset({ status: "todo", description: "" });

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

  // Edit Task form
  const editForm = useForm<AddTaskFormValues>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: { status: "todo" },
  });

  const openEdit = (task: Task) => {
    const taskStatus = getTaskStatus(task);
    setEditState({ open: true, task });
    editForm.reset({
      todo: task.todo,
      description: "",
      status: taskStatus,
    });
  };

  const onEditSubmit = async (values: AddTaskFormValues) => {
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

  const onDelete = async () => {
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

  // Derived data for different sections with proper status filtering
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
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, {user?.firstName || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your tasks today.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-4">
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              dispatch(setStatusFilter(value as TaskStatus))
            }
          >
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue>
                {statusOptions.find((opt) => opt.value === filterStatus)
                  ?.label || "All Tasks"}
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

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="flex items-center cursor-pointer gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogTitle>Add New Task</DialogTitle>
              <form
                onSubmit={addForm.handleSubmit(onAddSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="todo" className="mb-3.5">
                    Title *
                  </Label>
                  <Input
                    id="todo"
                    placeholder="Enter task title..."
                    {...addForm.register("todo")}
                  />
                  {addForm.formState.errors.todo && (
                    <p className="text-red-500 text-xs mt-1">
                      {addForm.formState.errors.todo.message}
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
                    {...addForm.register("description")}
                  />
                  {addForm.formState.errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {addForm.formState.errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status" className="mb-3.5">
                    Status *
                  </Label>
                  <Select
                    value={addForm.watch("status")}
                    onValueChange={(v) =>
                      addForm.setValue(
                        "status",
                        v as "todo" | "in-progress" | "done"
                      )
                    }
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue>
                        {statusOptions.find(
                          (opt) => opt.value === addForm.watch("status")
                        )?.label || "Select status"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions
                        .filter((opt) => opt.value !== "all")
                        .map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {addForm.formState.errors.status && (
                    <p className="text-red-500 text-xs mt-1">
                      {addForm.formState.errors.status.message}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 cursor-pointer"
                    disabled={isAdding}
                  >
                    {isAdding ? "Adding..." : "Add Task"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex flex-col gap-6">
        {/* Recent Tasks */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Recent Tasks</h2>
              <Badge variant="secondary" className="ml-auto text-xs">
                {recentTasks.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-muted-foreground text-sm">
                    Loading tasks...
                  </p>
                </div>
              ) : recentTasks.length > 0 ? (
                recentTasks.map((task: Task) => {
                  const taskStatus = getTaskStatus(task);
                  return (
                    <div
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
                        variant={
                          taskStatus === "done" ? "default" : "secondary"
                        }
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
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <List className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground text-sm mb-2">
                    No tasks found
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add your first task
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Task Overview Stats */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">Overview</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold mb-1 text-blue-600">
                  {todoTasks.length}
                </div>
                <div className="text-xs text-muted-foreground">To Do</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <div className="text-2xl font-bold mb-1 text-yellow-600">
                  {inProgressTasks.length}
                </div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30 col-span-2">
                <div className="text-2xl font-bold mb-1 text-green-600">
                  {doneTasks.length}
                </div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Work Section */}
        <div className="bg-card rounded-lg border p-6 lg:col-span-2 xl:col-span-1">
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
                {/* To Do Tasks */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <span>To Do</span>
                    <Badge variant="secondary" className="text-xs">
                      {todoTasks.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                    {todoTasks.length > 0 ? (
                      todoTasks.map((task: Task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <span
                            className="text-sm truncate flex-1 pr-2"
                            title={task.todo}
                          >
                            {task.todo}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs cursor-pointer"
                              onClick={() => openEdit(task)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-red-600 cursor-pointer"
                              onClick={() => setDeleteId(task.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        No to do tasks
                      </p>
                    )}
                  </div>
                </div>

                {/* In Progress Tasks */}
                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <span>In Progress</span>
                    <Badge className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      {inProgressTasks.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                    {inProgressTasks.length > 0 ? (
                      inProgressTasks.map((task: Task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200/50 dark:border-yellow-800/30"
                        >
                          <span
                            className="text-sm truncate flex-1 pr-2 text-yellow-800 dark:text-yellow-200"
                            title={task.todo}
                          >
                            {task.todo}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs cursor-pointer"
                              onClick={() => openEdit(task)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-red-600"
                              onClick={() => setDeleteId(task.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        No tasks in progress
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <span>Completed</span>
                    <Badge variant="default" className="text-xs">
                      {doneTasks.length}
                    </Badge>
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                    {doneTasks.length > 0 ? (
                      doneTasks.map((task: Task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-2 rounded bg-muted/30"
                        >
                          <span
                            className="text-sm line-through text-muted-foreground truncate flex-1 pr-2"
                            title={task.todo}
                          >
                            {task.todo}
                          </span>
                          <div className="flex gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs cursor-pointer"
                              onClick={() => openEdit(task)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-red-600"
                              onClick={() => setDeleteId(task.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        No completed tasks
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Task Dialog */}
      <Dialog
        open={editState.open}
        onOpenChange={(v: boolean) =>
          setEditState({ open: v, task: v ? editState.task : null })
        }
      >
        <DialogContent className="max-w-md">
          <DialogTitle>Edit Task</DialogTitle>
          <form
            onSubmit={editForm.handleSubmit(onEditSubmit)}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="edit-todo" className="mb-3.5">
                Title *
              </Label>
              <Input
                id="edit-todo"
                placeholder="Enter task title..."
                {...editForm.register("todo")}
              />
              {editForm.formState.errors.todo && (
                <p className="text-red-500 text-xs mt-1">
                  {editForm.formState.errors.todo.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description" className="mb-3.5">
                Description
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Optional description..."
                rows={3}
                {...editForm.register("description")}
              />
              {editForm.formState.errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {editForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-status" className="mb-3.5">
                Status *
              </Label>
              <Select
                value={editForm.watch("status")}
                onValueChange={(v) =>
                  editForm.setValue(
                    "status",
                    v as "todo" | "in-progress" | "done"
                  )
                }
              >
                <SelectTrigger id="edit-status" className="w-full">
                  <SelectValue>
                    {statusOptions.find(
                      (opt) => opt.value === editForm.watch("status")
                    )?.label || "Select status"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions
                    .filter((opt) => opt.value !== "all")
                    .map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {editForm.formState.errors.status.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={() => setEditState({ open: false, task: null })}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 cursor-pointer"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Task AlertDialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => setDeleteId(v ? deleteId : null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mb-4">
            Are you sure you want to delete this task? This action cannot be
            undone.
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
                onClick={onDelete}
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
