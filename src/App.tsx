import { Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Toaster } from './components/ui/sonner'


function App() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <Outlet />
        <Toaster />
      </div>
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  )
}

export default App
