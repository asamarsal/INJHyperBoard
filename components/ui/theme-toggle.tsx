"use client"

import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

interface ThemeToggleProps {
  isCollapsed?: boolean
}

export function ThemeToggle({ isCollapsed = false }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    setMounted(true)
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const initialTheme = savedTheme || 'light'
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const html = document.documentElement
    
    if (newTheme === 'dark') {
      html.classList.add('dark')
      html.classList.remove('light')
      html.style.colorScheme = 'dark'
      // Remove inline styles to let CSS variables take over
      html.style.removeProperty('--background')
      html.style.removeProperty('--foreground')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
      html.style.colorScheme = 'light'
      // No need for inline styles, CSS variables handle it
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return (
      <div className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg",
        isCollapsed && "justify-center px-2"
      )}>
        <div className="relative flex items-center justify-center w-5 h-5">
          <Sun className="h-5 w-5 text-amber-500" />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-white/[0.05] dark:hover:bg-white/[0.05] group",
        isCollapsed && "justify-center px-2"
      )}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="relative flex items-center justify-center w-5 h-5">
        {theme === 'dark' ? (
          <Moon className="h-5 w-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
        )}
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-foreground group-hover:text-cyan-400 transition-colors">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </p>
          <p className="text-xs text-muted-foreground">
            {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          </p>
        </div>
      )}
    </button>
  )
}
