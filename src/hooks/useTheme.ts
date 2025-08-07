import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme') as Theme
    if (saved && (saved === 'light' || saved === 'dark')) {
      return saved
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    // Update localStorage and document class
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return { theme, toggle, setTheme }
} 