// export interface StoredTask {
//     id: number
//     todo: string
//     completed: boolean
//     userId: number
//     isLocal?: boolean // Flag to identify locally created tasks
//   }
  
//   const STORAGE_KEY = 'taskboard_local_tasks'
  
//   export const taskStorage = {
//     // Get all local tasks
//     getLocalTasks: (): StoredTask[] => {
//       try {
//         const stored = localStorage.getItem(STORAGE_KEY)
//         return stored ? JSON.parse(stored) : []
//       } catch {
//         return []
//       }
//     },
  
//     // Save a new local task
//     saveLocalTask: (task: StoredTask): void => {
//       try {
//         const tasks = taskStorage.getLocalTasks()
//         const newTask = { ...task, isLocal: true }
//         tasks.push(newTask)
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
//       } catch (error) {
//         console.error('Failed to save local task:', error)
//       }
//     },
  
//     // Update a local task
//     updateLocalTask: (id: number, updates: Partial<StoredTask>): void => {
//       try {
//         const tasks = taskStorage.getLocalTasks()
//         const index = tasks.findIndex(task => task.id === id)
//         if (index !== -1) {
//           tasks[index] = { ...tasks[index], ...updates }
//           localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
//         }
//       } catch (error) {
//         console.error('Failed to update local task:', error)
//       }
//     },
  
//     // Delete a local task
//     deleteLocalTask: (id: number): void => {
//       try {
//         const tasks = taskStorage.getLocalTasks()
//         const filtered = tasks.filter(task => task.id !== id)
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
//       } catch (error) {
//         console.error('Failed to delete local task:', error)
//       }
//     },
  
//     // Clear all local tasks
//     clearLocalTasks: (): void => {
//       try {
//         localStorage.removeItem(STORAGE_KEY)
//       } catch (error) {
//         console.error('Failed to clear local tasks:', error)
//       }
//     }
//   }
  

export interface StoredTask {
    id: number
    todo: string
    completed: boolean
    status?: 'todo' | 'in-progress' | 'done'
    userId: number
    isLocal?: boolean // Flag to identify locally created tasks
  }
  
  const STORAGE_KEY = 'taskboard_local_tasks'
  
  export const taskStorage = {
    // Get all local tasks
    getLocalTasks: (): StoredTask[] => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : []
      } catch {
        return []
      }
    },
  
    // Save a new local task
    saveLocalTask: (task: StoredTask): void => {
      try {
        const tasks = taskStorage.getLocalTasks()
        const newTask = { ...task, isLocal: true }
        tasks.push(newTask)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
      } catch (error) {
        console.error('Failed to save local task:', error)
      }
    },
  
    // Update a local task
    updateLocalTask: (id: number, updates: Partial<StoredTask>): void => {
      try {
        const tasks = taskStorage.getLocalTasks()
        const index = tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          tasks[index] = { ...tasks[index], ...updates }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        }
      } catch (error) {
        console.error('Failed to update local task:', error)
      }
    },
  
    // Delete a local task
    deleteLocalTask: (id: number): void => {
      try {
        const tasks = taskStorage.getLocalTasks()
        const filtered = tasks.filter(task => task.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
      } catch (error) {
        console.error('Failed to delete local task:', error)
      }
    },
  
    // Clear all local tasks
    clearLocalTasks: (): void => {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error('Failed to clear local tasks:', error)
      }
    }
  }
  