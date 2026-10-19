import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('aima_theme');
    if (saved) return saved === 'dark';
    return false; // Default to the signature warm ivory (#F3F5EF) palette from Learning App Design
  });

  useEffect(() => {
    localStorage.setItem('aima_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark-theme', 'dark');
      document.documentElement.classList.remove('light-theme', 'light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.add('light-theme', 'light');
      document.documentElement.classList.remove('dark-theme', 'dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
