import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import { Layout } from '../components/Layout'

// Define the type for the auth slice
interface AuthState {
  isAuthenticated: boolean;
  id: number;
  token: string;
  // Add other fields as needed
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    const state = context.store.getState() as RootState
    if (!(state.auth).isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const isAuthenticated = useSelector((state: RootState) => (state.auth).isAuthenticated)
  
  if (!isAuthenticated) {
    return null
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
