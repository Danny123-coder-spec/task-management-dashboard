import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from '@tanstack/react-router'
import { Input } from './ui/input'
import { Sun, Moon, Search, LogOut } from 'lucide-react'
import { type RootState } from '../store'
import { useTheme } from '../hooks/useTheme'
import { Button } from './ui/button'
import { setSearchQuery } from '../store/slices/filterSlice'
import { logout } from '../store/slices/authSlice'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

// Define the type for the filter slice
interface FilterState {
  searchQuery: string;
  status: string; // or TaskStatus if you have it defined elsewhere
}

export const Header: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const searchQuery = useSelector((state: RootState) => (state.filter as FilterState).searchQuery)
  const user = useSelector((state: RootState) => state.auth.user)
  const { theme, toggle } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    navigate({ to: '/login' })
  }

  // Generate user initials
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    const first = firstName?.charAt(0).toUpperCase() || ''
    const last = lastName?.charAt(0).toUpperCase() || ''
    return first + last
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-8 py-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="font-semibold text-xl">TaskBoard</div>
      
      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-10 bg-muted/50 border-0 focus:bg-background"
          />
        </div>
      </div>
      
      {/* Right side - Theme toggle and user */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative bg-primary h-8 w-8 rounded-full">
              <div className="rounded-full  text-primary-foreground w-8 h-8 flex items-center justify-center font-semibold text-sm">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
