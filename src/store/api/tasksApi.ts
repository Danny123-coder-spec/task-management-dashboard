import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../index";
import { taskStorage } from "../../utils/taskStorage";

export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  status?: TaskStatus;
  isLocal?: boolean;
}

interface TasksResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

interface CreateTaskRequest {
  todo: string;
  completed: boolean;
  status?: TaskStatus;
  userId: number;
}

interface UpdateTaskRequest {
  id: number;
  todo?: string;
  completed?: boolean;
  status?: TaskStatus;
}

// Helper function to convert between completed boolean and status
const getStatusFromCompleted = (
  completed: boolean,
  status?: TaskStatus
): TaskStatus => {
  if (status) return status;
  return completed ? "done" : "todo";
};

const getCompletedFromStatus = (status: TaskStatus): boolean => {
  return status === "done";
};

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://dummyjson.com/todos",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<TasksResponse, { userId?: number }>({
      query: ({ userId }) => (userId ? `/user/${userId}` : ""),
      transformResponse: (response: TasksResponse, _meta, arg) => {
        
        const transformedRemoteTasks = response.todos.map((task) => ({
          ...task,
          status: getStatusFromCompleted(task.completed) as TaskStatus,
        }));

        // Merge remote tasks with local tasks
        const localTasks = taskStorage
          .getLocalTasks()
          .filter((task) => task.userId === arg.userId);

        return {
          ...response,
          todos: [...transformedRemoteTasks, ...localTasks],
          total: response.total + localTasks.length,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.todos.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    createTask: builder.mutation<Task, CreateTaskRequest>({
      queryFn: async (newTask) => {
        try {
         
          const serverPayload = {
            todo: newTask.todo,
            completed: getCompletedFromStatus(newTask.status || "todo"),
            userId: newTask.userId,
          };

          const response = await fetch("https://dummyjson.com/todos/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serverPayload),
          });

          if (!response.ok) throw new Error("Server request failed");

          const serverTask = await response.json();

          // saving locally for persistence with status
          const localTask = {
            ...serverTask,
            id: Date.now(),
            status: newTask.status || "todo",
            isLocal: true,
          };
          taskStorage.saveLocalTask(localTask);

          return { data: localTask };
        } catch (error) {
        
          const localTask = {
            ...newTask,
            id: Date.now(),
            status: newTask.status || "todo",
            completed: getCompletedFromStatus(newTask.status || "todo"),
            isLocal: true,
          };
          taskStorage.saveLocalTask(localTask);
          return { data: localTask };
        }
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<Task, UpdateTaskRequest>({
      // Add optimistic update
      onQueryStarted: async ({ id, ...patch }, { dispatch, queryFulfilled, getState }) => {
        // Get the current user ID from state
        const state = getState() as RootState;
        const userId = state.auth.user?.id;
        
        // Optimistically update the cache
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', { userId }, (draft) => {
            const task = draft.todos.find(t => t.id === id);
            if (task) {
              if (patch.todo !== undefined) task.todo = patch.todo;
              if (patch.status !== undefined) {
                task.status = patch.status;
                task.completed = getCompletedFromStatus(patch.status);
              }
              if (patch.completed !== undefined) {
                task.completed = patch.completed;
                task.status = getStatusFromCompleted(patch.completed);
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert the optimistic update on error
          patchResult.undo();
        }
      },
      queryFn: async ({ id, ...patch }) => {
        try {
          
          const serverPayload: any = {};
          if (patch.todo !== undefined) serverPayload.todo = patch.todo;
          if (patch.status !== undefined) {
            serverPayload.completed = getCompletedFromStatus(patch.status);
          } else if (patch.completed !== undefined) {
            serverPayload.completed = patch.completed;
          }
          const response = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(serverPayload),
          });

          if (!response.ok) throw new Error("Server request failed");

          const serverTask = await response.json();

          //   Prepare local update with status
          const localUpdate: any = { ...patch };
          if (patch.status !== undefined) {
            localUpdate.completed = getCompletedFromStatus(patch.status);
          }

          
          taskStorage.updateLocalTask(id, localUpdate);

          // Return the updated task with all properties
          const updatedTask = { 
            ...serverTask, 
            id, 
            ...localUpdate,
            status: patch.status || getStatusFromCompleted(serverTask.completed)
          };

          return { data: updatedTask };
        } catch (error) {
         
          const localUpdate: any = { ...patch };
          if (patch.status !== undefined) {
            localUpdate.completed = getCompletedFromStatus(patch.status);
          }

          taskStorage.updateLocalTask(id, localUpdate);
          
          // Return the updated task
          const updatedTask = { 
            id, 
            ...localUpdate,
            status: patch.status || (patch.completed !== undefined ? getStatusFromCompleted(patch.completed) : "todo")
          } as Task;
          
          return { data: updatedTask };
        }
      },
      // Invalidate both the specific task and the list
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" }
      ],
    }),
    deleteTask: builder.mutation<{ id: number; isDeleted: boolean }, number>({
      queryFn: async (id) => {
        try {
          const response = await fetch(`https://dummyjson.com/todos/${id}`, {
            method: "DELETE",
          });

          if (!response.ok) throw new Error("Server request failed");

          // delete locally
          taskStorage.deleteLocalTask(id);

          return { data: { id, isDeleted: true } };
        } catch (error) {
          taskStorage.deleteLocalTask(id);
          return { data: { id, isDeleted: true } };
        }
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;