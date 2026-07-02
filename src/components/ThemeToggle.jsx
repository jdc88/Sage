import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useDashboard();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-sage-dark-text transition-colors duration-150 shadow-sm border border-slate-200/50 dark:border-sage-dark-mid/50"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      id="theme-toggle-btn"
    >
      {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};
