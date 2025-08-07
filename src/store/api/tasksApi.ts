// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import type { RootState } from '../index'
// import { taskStorage } from '../../utils/taskStorage'

// export interface Task {
//   id: number
//   todo: string
//   completed: boolean
//   userId: number
//   isLocal?: boolean
// }

// interface TasksResponse {
//   todos: Task[]
//   total: number
//   skip: number
//   limit: number
// }

// interface CreateTaskRequest {
//   todo: string
//   completed: boolean
//   userId: number
// }

// interface UpdateTaskRequest {
//   id: number
//   todo?: string
//   completed?: boolean
// }

// export const tasksApi = createApi({
//   reducerPath: 'tasksApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'https://dummyjson.com/todos',
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as RootState).auth.token
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`)
//       }
//       return headers
//     },
//   }),
//   tagTypes: ['Task'],
//   endpoints: (builder) => ({
//     getTasks: builder.query<TasksResponse, { userId?: number }>({
//       query: ({ userId }) => userId ? `/user/${userId}` : '',
//       transformResponse: (response: TasksResponse, meta, arg) => {
//         // Merge remote tasks with local tasks
//         const localTasks = taskStorage.getLocalTasks().filter(
//           task => task.userId === arg.userId
//         )
        
//         return {
//           ...response,
//           todos: [...response.todos, ...localTasks],
//           total: response.total + localTasks.length
//         }
//       },
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.todos.map(({ id }) => ({ type: 'Task' as const, id })),
//               { type: 'Task', id: 'LIST' },
//             ]
//           : [{ type: 'Task', id: 'LIST' }],
//     }),
//     createTask: builder.mutation<Task, CreateTaskRequest>({
//       queryFn: async (newTask, { getState }) => {
//         try {
//           // Try to create on server first
//           const response = await fetch('https://dummyjson.com/todos/add', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(newTask),
//           })
          
//           if (!response.ok) throw new Error('Server request failed')
          
//           const serverTask = await response.json()
          
//           // Also save locally for persistence
//           const localTask = {
//             ...serverTask,
//             id: Date.now(), // Use timestamp as ID for local storage
//             isLocal: true
//           }
//           taskStorage.saveLocalTask(localTask)
          
//           return { data: localTask }
//         } catch (error) {
//           // Fallback to local storage only
//           const localTask = {
//             ...newTask,
//             id: Date.now(),
//             isLocal: true
//           }
//           taskStorage.saveLocalTask(localTask)
//           return { data: localTask }
//         }
//       },
//       invalidatesTags: [{ type: 'Task', id: 'LIST' }],
//     }),
//     updateTask: builder.mutation<Task, UpdateTaskRequest>({
//       queryFn: async ({ id, ...patch }, { getState }) => {
//         try {
//           // Try server update first
//           const response = await fetch(`https://dummyjson.com/todos/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(patch),
//           })
          
//           if (!response.ok) throw new Error('Server request failed')
          
//           const serverTask = await response.json()
          
//           // Also update locally
//           taskStorage.updateLocalTask(id, patch)
          
//           return { data: { ...serverTask, id } }
//         } catch (error) {
//           // Fallback to local update only
//           taskStorage.updateLocalTask(id, patch)
//           return { data: { id, ...patch } as Task }
//         }
//       },
//       invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
//     }),
//     deleteTask: builder.mutation<{ id: number; isDeleted: boolean }, number>({
//       queryFn: async (id) => {
//         try {
//           // Try server delete first
//           const response = await fetch(`https://dummyjson.com/todos/${id}`, {
//             method: 'DELETE',
//           })
          
//           if (!response.ok) throw new Error('Server request failed')
          
//           // Also delete locally
//           taskStorage.deleteLocalTask(id)
          
//           return { data: { id, isDeleted: true } }
//         } catch (error) {
//           // Fallback to local delete only
//           taskStorage.deleteLocalTask(id)
//           return { data: { id, isDeleted: true } }
//         }
//       },
//       invalidatesTags: [{ type: 'Task', id: 'LIST' }],
//     }),
//   }),
// })

// export const {
//   useGetTasksQuery,
//   useCreateTaskMutation,
//   useUpdateTaskMutation,
//   useDeleteTaskMutation,
// } = tasksApi

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../index'
import { taskStorage } from '../../utils/taskStorage'

export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: number
  todo: string
  completed: boolean
  userId: number
  status?: TaskStatus // Add status field for three-state support
  isLocal?: boolean
}

interface TasksResponse {
  todos: Task[]
  total: number
  skip: number
  limit: number
}

interface CreateTaskRequest {
  todo: string
  completed: boolean
  status?: TaskStatus
  userId: number
}

interface UpdateTaskRequest {
  id: number
  todo?: string
  completed?: boolean
  status?: TaskStatus
}

// Helper function to convert between completed boolean and status
const getStatusFromCompleted = (completed: boolean, status?: TaskStatus): TaskStatus => {
  if (status) return status
  return completed ? 'done' : 'todo'
}

const getCompletedFromStatus = (status: TaskStatus): boolean => {
  return status === 'done'
}

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com/todos',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, { userId?: number }>({
      query: ({ userId }) => userId ? `/user/${userId}` : '',
      transformResponse: (response: TasksResponse, meta, arg) => {
        // Transform remote tasks to include status
        const transformedRemoteTasks = response.todos.map(task => ({
          ...task,
          status: getStatusFromCompleted(task.completed) as TaskStatus
        }))
        
        // Merge remote tasks with local tasks
        const localTasks = taskStorage.getLocalTasks().filter(
          task => task.userId === arg.userId
        )
        
        return {
          ...response,
          todos: [...transformedRemoteTasks, ...localTasks],
          total: response.total + localTasks.length
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.todos.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation<Task, CreateTaskRequest>({
      queryFn: async (newTask, { getState }) => {
        try {
          // Try to create on server first
          const serverPayload = {
            todo: newTask.todo,
            completed: getCompletedFromStatus(newTask.status || 'todo'),
            userId: newTask.userId
          }
          
          const response = await fetch('https://dummyjson.com/todos/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serverPayload),
          })
          
          if (!response.ok) throw new Error('Server request failed')
          
          const serverTask = await response.json()
          
          // Also save locally for persistence with status
          const localTask = {
            ...serverTask,
            id: Date.now(), // Use timestamp as ID for local storage
            status: newTask.status || 'todo',
            isLocal: true
          }
          taskStorage.saveLocalTask(localTask)
          
          return { data: localTask }
        } catch (error) {
          // Fallback to local storage only
          const localTask = {
            ...newTask,
            id: Date.now(),
            status: newTask.status || 'todo',
            completed: getCompletedFromStatus(newTask.status || 'todo'),
            isLocal: true
          }
          taskStorage.saveLocalTask(localTask)
          return { data: localTask }
        }
      },
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      queryFn: async ({ id, ...patch }, { getState }) => {
        try {
          // Prepare server payload
          const serverPayload: any = {}
          if (patch.todo !== undefined) serverPayload.todo = patch.todo
          if (patch.status !== undefined) {
            serverPayload.completed = getCompletedFromStatus(patch.status)
          } else if (patch.completed !== undefined) {
            serverPayload.completed = patch.completed
          }
          
          // Try server update first
          const response = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(serverPayload),
          })
          
          if (!response.ok) throw new Error('Server request failed')
          
          const serverTask = await response.json()
          
          // Prepare local update with status
          const localUpdate: any = { ...patch }
          if (patch.status !== undefined) {
            localUpdate.completed = getCompletedFromStatus(patch.status)
          }
          
          // Also update locally
          taskStorage.updateLocalTask(id, localUpdate)
          
          return { data: { ...serverTask, id, ...localUpdate } }
        } catch (error) {
          // Fallback to local update only
          const localUpdate: any = { ...patch }
          if (patch.status !== undefined) {
            localUpdate.completed = getCompletedFromStatus(patch.status)
          }
          
          taskStorage.updateLocalTask(id, localUpdate)
          return { data: { id, ...localUpdate } as Task }
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
    deleteTask: builder.mutation<{ id: number; isDeleted: boolean }, number>({
      queryFn: async (id) => {
        try {
          // Try server delete first
          const response = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) throw new Error('Server request failed')
          
          // Also delete locally
          taskStorage.deleteLocalTask(id)
          
          return { data: { id, isDeleted: true } }
        } catch (error) {
          // Fallback to local delete only
          taskStorage.deleteLocalTask(id)
          return { data: { id, isDeleted: true } }
        }
      },
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi
