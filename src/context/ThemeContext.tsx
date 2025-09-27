import React, { createContext, useState } from 'react';
import { getThemeStyles } from '../styles/themeStyles';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  getThemeStyles: () => any;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  getThemeStyles: () => ({}),
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('quiz-theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('quiz-theme', JSON.stringify(newTheme));
  };

  const contextValue = {
    isDarkMode,
    toggleTheme,
    getThemeStyles: () => getThemeStyles(isDarkMode),
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};
