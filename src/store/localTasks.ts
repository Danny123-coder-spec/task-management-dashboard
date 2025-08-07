// Utility functions to persist tasks in localStorage for the current user
import type { Task } from './api/tasksApi'

const LOCAL_KEY_PREFIX = 'local_tasks_user_'

export function getLocalTasks(userId: number): Task[] {
  const raw = localStorage.getItem(LOCAL_KEY_PREFIX + userId)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Task[]
  } catch {
    return []
  }
}

export function addLocalTask(userId: number, task: Task) {
  const tasks = getLocalTasks(userId)
  tasks.unshift(task)
  localStorage.setItem(LOCAL_KEY_PREFIX + userId, JSON.stringify(tasks))
}

export function updateLocalTask(userId: number, id: number, patch: Partial<Task>) {
  const tasks = getLocalTasks(userId)
  const idx = tasks.findIndex(t => t.id === id)
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...patch }
    localStorage.setItem(LOCAL_KEY_PREFIX + userId, JSON.stringify(tasks))
  }
}

export function deleteLocalTask(userId: number, id: number) {
  const tasks = getLocalTasks(userId)
  const filtered = tasks.filter(t => t.id !== id)
  localStorage.setItem(LOCAL_KEY_PREFIX + userId, JSON.stringify(filtered))
}
