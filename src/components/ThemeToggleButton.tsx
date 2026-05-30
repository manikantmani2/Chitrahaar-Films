import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import type { ThemeMode } from '@/hooks/useTheme';

interface ThemeToggleButtonProps {
  theme: ThemeMode;
  onToggle: () => void;
  compact?: boolean;
  className?: string;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ theme, onToggle, compact = false, className = '' }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary/75 px-4 py-2 text-sm font-semibold text-text-primary backdrop-blur-md shadow-sm hover:border-accent hover:bg-secondary ${compact ? 'h-11 w-11 px-0 py-0' : ''} ${className}`}
    >
      {isDark ? <FaSun className="text-accent" /> : <FaMoon className="text-accent" />}
      {!compact && <span>{isDark ? 'Dark' : 'Light'}</span>}
    </button>
  );
};

export default ThemeToggleButton;
