import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import { Layout } from '../components/Layout'

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
