import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'all'

interface FilterState {
  status: TaskStatus
  searchQuery: string
}

const initialState: FilterState = {
  status: 'all',
  searchQuery: '',
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<TaskStatus>) => {
      state.status = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    clearFilters: (state) => {
      state.status = 'all'
      state.searchQuery = ''
    },
  },
})

export const { setStatusFilter, setSearchQuery, clearFilters } = filterSlice.actions
