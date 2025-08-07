import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { QueryClient } from '@tanstack/react-query'
import { store } from '../store'
import { Toaster } from 'sonner'

interface MyRouterContext {
  queryClient: QueryClient
  store: typeof store
}

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground">Page not found</p>
      </div>
    </div>
  )
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Outlet />
        <Toaster position="top-right" />
      </div>
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  )
}
