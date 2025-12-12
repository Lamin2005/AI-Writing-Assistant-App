import React from 'react';
import { PenLine, Moon, Sun, History } from 'lucide-react';
import { Button } from './Button';

interface HeaderProps {
  onToggleHistory: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleHistory,
  isDark, 
  toggleTheme 
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-primary-500 to-indigo-600 p-2 rounded-lg">
              <PenLine className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-none">
                Lumina Writer
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">AI WRITING ASSISTANT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggleHistory} className="hidden sm:flex" aria-label="History">
              <History className="h-5 w-5 mr-2" />
              History
            </Button>
             <Button variant="ghost" size="sm" onClick={onToggleHistory} className="sm:hidden" aria-label="History">
              <History className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};