import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authSlice } from './slices/authSlice'
import { filterSlice } from './slices/filterSlice'
import { tasksApi } from './api/tasksApi'
import { authApi } from './api/authApi'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    filter: filterSlice.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tasksApi.middleware,
      authApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
